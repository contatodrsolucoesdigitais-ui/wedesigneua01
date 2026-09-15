// Worker com static assets + API de leads sobre Supabase.
//
// Os arquivos de public/ sao servidos primeiro pela plataforma; este codigo
// so roda para caminhos que nao batem com um arquivo — na pratica, /api/*.
//
// Secrets necessarios (Settings > Variables and Secrets, no painel):
//   SUPABASE_URL          a URL do projeto, https://<ref>.supabase.co
//   SUPABASE_SERVICE_KEY  a chave service_role — NUNCA a publishable
//   PANEL_PASSWORD        senha do painel
// Opcionais: RESEND_API_KEY, NOTIFY_EMAIL, NOTIFY_FROM
//
// Por que service_role e nao publishable: a publishable e publica por
// design, entao usa-la exigiria abrir o RLS para anonimo — e ai qualquer
// um inseriria leads e, pior, leria a lista inteira de prospects. Com a
// service_role o RLS fica fechado para todos e so este Worker toca a tabela.

const SEC = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin'
};

function json(data, status) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...SEC }
  });
}

function clean(v, max) {
  return String(v == null ? '' : v).replace(/\s+/g, ' ').trim().slice(0, max || 200);
}

// Comparacao em tempo constante — nao vaza a senha por timing
function safeEqual(a, b) {
  const enc = new TextEncoder();
  const x = enc.encode(String(a || ''));
  const y = enc.encode(String(b || ''));
  let diff = x.length ^ y.length;
  const n = Math.max(x.length, y.length);
  for (let i = 0; i < n; i++) diff |= (x[i] || 0) ^ (y[i] || 0);
  return diff === 0;
}

function authorized(request, env) {
  if (!env.PANEL_PASSWORD) return false;          // sem senha definida, nega tudo
  return safeEqual(request.headers.get('x-painel-key'), env.PANEL_PASSWORD);
}

function configured(env) {
  return Boolean(env.SUPABASE_URL && env.SUPABASE_SERVICE_KEY);
}

// Chamada ao PostgREST do Supabase
function sb(env, path, init) {
  const key = env.SUPABASE_SERVICE_KEY;
  const base = env.SUPABASE_URL.replace(/\/+$/, '');
  const extra = (init && init.headers) || {};
  return fetch(base + '/rest/v1/' + path, {
    ...init,
    headers: {
      apikey: key,
      Authorization: 'Bearer ' + key,
      'Content-Type': 'application/json',
      ...extra
    }
  });
}

async function notify(env, lead) {
  const key = env.RESEND_API_KEY, to = env.NOTIFY_EMAIL, from = env.NOTIFY_FROM;
  if (!key || !to || !from) return;
  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: from,
        to: to,
        subject: '[LEAD] ' + lead.company + ' - ' + (lead.town || '?'),
        text: [
          'Empresa: ' + lead.company,
          'Cidade: ' + lead.town,
          'Telefone: ' + lead.phone,
          'Ramo: ' + lead.trade,
          'Nicho: ' + lead.niche,
          '',
          'Abra o painel para acompanhar o funil.'
        ].join('\n')
      })
    });
  } catch (_) { /* nunca derruba o lead por falha de e-mail */ }
}

// POST /api/lead — publico
async function postLead(request, env, ctx) {
  let b;
  try { b = await request.json(); } catch (_) { return json({ error: 'bad_json' }, 400); }

  // honeypot: bot preenche, humano nao ve
  if (clean(b.website)) return json({ ok: true });

  const lead = {
    company: clean(b.company, 120),
    town: clean(b.town, 80),
    phone: clean(b.phone, 40),
    trade: clean(b.trade, 120),
    niche: clean(b.niche, 40) || 'unknown',
    source: clean(b.source, 200)
  };

  if (!lead.company) return json({ error: 'company_required' }, 400);
  if (!configured(env)) return json({ error: 'db_not_configured' }, 500);

  try {
    const r = await sb(env, 'leads', {
      method: 'POST',
      headers: { Prefer: 'return=minimal' },
      body: JSON.stringify(lead)
    });
    if (!r.ok) {
      console.error('supabase insert failed', r.status, await r.text());
      return json({ error: 'server_error' }, 500);
    }
    ctx.waitUntil(notify(env, lead));             // nao atrasa a resposta ao visitante
    return json({ ok: true });
  } catch (err) {
    console.error('lead insert failed', err);
    return json({ error: 'server_error' }, 500);
  }
}

// GET /api/leads — painel
async function getLeads(request, env) {
  if (!authorized(request, env)) return json({ error: 'unauthorized' }, 401);
  if (!configured(env)) return json({ error: 'db_not_configured' }, 500);
  try {
    const cols = 'id,created_at,niche,company,town,phone,trade,status,note';
    const r = await sb(env, 'leads?select=' + cols + '&order=created_at.desc&limit=500');
    if (!r.ok) {
      console.error('supabase read failed', r.status, await r.text());
      return json({ error: 'server_error' }, 500);
    }
    return json({ leads: await r.json() });
  } catch (err) {
    console.error('leads read failed', err);
    return json({ error: 'server_error' }, 500);
  }
}

// PATCH /api/leads — painel
async function patchLead(request, env) {
  if (!authorized(request, env)) return json({ error: 'unauthorized' }, 401);
  if (!configured(env)) return json({ error: 'db_not_configured' }, 500);

  let b;
  try { b = await request.json(); } catch (_) { return json({ error: 'bad_json' }, 400); }

  const id = parseInt(b.id, 10);
  if (!id) return json({ error: 'id_required' }, 400);

  const allowed = ['new', 'called', 'meeting', 'won', 'lost'];
  const patch = {};
  if (allowed.indexOf(b.status) !== -1) patch.status = b.status;
  if (b.note != null) patch.note = String(b.note).slice(0, 800);
  if (Object.keys(patch).length === 0) return json({ error: 'nothing_to_update' }, 400);

  try {
    const r = await sb(env, 'leads?id=eq.' + id, {
      method: 'PATCH',
      headers: { Prefer: 'return=minimal' },
      body: JSON.stringify(patch)
    });
    if (!r.ok) {
      console.error('supabase update failed', r.status, await r.text());
      return json({ error: 'server_error' }, 500);
    }
    return json({ ok: true });
  } catch (err) {
    console.error('leads update failed', err);
    return json({ error: 'server_error' }, 500);
  }
}

export default {
  async fetch(request, env, ctx) {
    const pathname = new URL(request.url).pathname;
    const method = request.method;

    if (pathname === '/api/lead') {
      if (method !== 'POST') return json({ error: 'method_not_allowed' }, 405);
      return postLead(request, env, ctx);
    }

    if (pathname === '/api/leads') {
      if (method === 'GET') return getLeads(request, env);
      if (method === 'PATCH') return patchLead(request, env);
      return json({ error: 'method_not_allowed' }, 405);
    }

    // Qualquer outra coisa volta para os arquivos estaticos
    return env.ASSETS.fetch(request);
  }
};
