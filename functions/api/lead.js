// Cloudflare Pages Function — POST /api/lead
// Binding necessario: DB (D1)  ·  Opcionais: RESEND_API_KEY, NOTIFY_EMAIL, NOTIFY_FROM

function clean(v, max) {
  return String(v == null ? '' : v).replace(/\s+/g, ' ').trim().slice(0, max || 200);
}

function json(data, status) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

async function notify(env, lead) {
  const { RESEND_API_KEY: key, NOTIFY_EMAIL: to, NOTIFY_FROM: from } = env;
  if (!key || !to || !from) return;              // opcional: so envia se configurado
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

export async function onRequestPost({ request, env, waitUntil }) {
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

    // nao bloqueia a resposta ao visitante
    if (waitUntil) waitUntil(notify(env, lead)); else notify(env, lead);
    return json({ ok: true });
  } catch (err) {
    console.error('lead insert failed', err);
    return json({ error: 'server_error' }, 500);
  }
}

export async function onRequest() {
  return new Response('Method Not Allowed', { status: 405, headers: { Allow: 'POST' } });
}
