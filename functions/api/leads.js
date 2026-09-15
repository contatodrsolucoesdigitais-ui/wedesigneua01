// Cloudflare Pages Function — GET/PATCH /api/leads (painel)
// Bindings: DB (D1)  ·  PANEL_PASSWORD (secret)

function json(data, status) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
  });
}

// Comparacao em tempo constante — evita vazar a senha por timing
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

export async function onRequestGet({ request, env }) {
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

export async function onRequestPatch({ request, env }) {
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

export async function onRequest() {
  return new Response('Method Not Allowed', { status: 405, headers: { Allow: 'GET, PATCH' } });
}
