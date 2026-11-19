export async function onRequestPost(context) {
  const { request, env } = context;
  let body = {};
  try { body = await request.json(); } catch (e) {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 });
  }
  const name = String(body.name || '').trim();
  const email = String(body.email || '').trim().toLowerCase();
  const password = String(body.password || '');
  if (!name || !email || password.length < 6) {
    return new Response(JSON.stringify({ error: 'Data registrasi tidak lengkap' }), { status: 400 });
  }
  if (env.USERS_KV) {
    const existing = await env.USERS_KV.get(`user:${email}`);
    if (existing) {
      return new Response(JSON.stringify({ error: 'Email sudah terdaftar' }), { status: 409 });
    }
    await env.USERS_KV.put(`user:${email}`, JSON.stringify({ name, email, password, createdAt: new Date().toISOString() }));
  }
  return new Response(JSON.stringify({ ok: true, user: `${name} (${email})` }), {
    status: 201,
    headers: { 'Content-Type': 'application/json' }
  });
}
