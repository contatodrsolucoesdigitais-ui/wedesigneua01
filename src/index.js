// Worker com static assets.
// Os arquivos de public/ sao servidos primeiro pela plataforma; este codigo
// so roda para caminhos que nao batem com um arquivo — na pratica, /api/*.
//
// Bindings: DB (D1, em wrangler.jsonc) · PANEL_PASSWORD (secret)
// Opcionais: RESEND_API_KEY, NOTIFY_EMAIL, NOTIFY_FROM

const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin'
};

function json(data, status) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...SECURITY_HEADERS }
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
  if (!env.PANEL_PASSWORD) return false;        // sem senha definida, nega tudo
  return safeEqual(request.headers.get('x-painel-key'), env.PANEL_PASSWORD);
}

async function notify(env, lead) {
  const { RESEND_API_KEY: key, NOTIFY_EMAIL: to, NOTIFY_FROM: from } = env;
  if (!key || !to || !from) return;             // opcional: so envia se configurado
  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from, to,
        subject: `[LEAD] ${lead.company} - ${lead.town || '?'}`,
        text: [
          `Empresa: ${lead.company}`,
          `Cidade: ${lead.town}`,
          `Telefone: ${lead.phone}`,
          `Ramo: ${lead.trade}`,
          `Nicho: ${lead.niche}`,
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
    town:    clean(b.town, 80),
    phone:   clean(b.phone, 40),
    trade:   clean(b.trade, 120),
    niche:   clean(b.niche, 40) || 'unknown',
    source:  clean(b.source, 200)
  };

  if (!lead.company) return json({ error: 'company_required' }, 400);
  if (!env.DB) return json({ error: 'db_not_bound' }, 500);

  try {
    await env.DB.prepare(
      `INSERT INTO leads (niche, company, town, phone, trade, source)
       VALUES (?, ?, ?, ?, ?, ?)`
    ).bind(lead.niche, lead.company, lead.town, lead.phone, lead.trade, lead.source).run();

    ctx.waitUntil(notify(env, lead));           // nao atrasa a resposta ao visitante
    return json({ ok: true });
  } catch (err) {
    console.error('lead insert failed', err);
    return json({ error: 'server_error' }, 500);
  }
}

// GET /api/leads — painel
async function getLeads(request, env) {
  if (!authorized(request, env)) return json({ error: 'unauthorized' }, 401);
  if (!env.DB) return json({ error: 'db_not_bound' }, 500);
  try {
    const { results } = await env.DB.prepare(
      `SELECT id, created_at, niche, company, town, phone, trade, status, note
       FROM leads ORDER BY created_at DESC, id DESC LIMIT 500`
    ).all();
    return json({ leads: results || [] });
  } catch (err) {
    console.error('leads read failed', err);
    return json({ error: 'server_error' }, 500);
  }
}

// PATCH /api/leads — painel
async function patchLead(request, env) {
  if (!authorized(request, env)) return json({ error: 'unauthorized' }, 401);
  if (!env.DB) return json({ error: 'db_not_bound' }, 500);

  let b;
  try { b = await request.json(); } catch (_) { return json({ error: 'bad_json' }, 400); }

  const id = parseInt(b.id, 10);
  if (!id) return json({ error: 'id_required' }, 400);

  const allowed = ['new', 'called', 'meeting', 'won', 'lost'];
  const status = allowed.includes(b.status) ? b.status : null;
  const note = b.note == null ? null : String(b.note).slice(0, 800);

  try {
    if (status !== null) {
      await env.DB.prepare('UPDATE leads SET status = ? WHERE id = ?').bind(status, id).run();
    }
    if (note !== null) {
      await env.DB.prepare('UPDATE leads SET note = ? WHERE id = ?').bind(note, id).run();
    }
    return json({ ok: true });
  } catch (err) {
    console.error('leads update failed', err);
    return json({ error: 'server_error' }, 500);
  }
}

export default {
  async fetch(request, env, ctx) {
    const { pathname } = new URL(request.url);
    const method = request.method;

    if (pathname === '/api/lead') {
      if (method !== 'POST') return json({ error: 'method_not_allowed' }, 405);
      return postLead(request, env, ctx);
    }

    if (pathname === '/api/leads') {
      if (method === 'GET')   return getLeads(request, env);
      if (method === 'PATCH') return patchLead(request, env);
      return json({ error: 'method_not_allowed' }, 405);
    }

    // Qualquer outra coisa volta para os arquivos estaticos
    return env.ASSETS.fetch(request);
  }
};
