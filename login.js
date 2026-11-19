export async function onRequestPost(context) {
  const { request, env } = context;
  let body = {};
  try {
    body = await request.json();
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 });
  }

  const expectedUser = (env.APP_USERNAME || 'admin@nsd.bni.co.id').toLowerCase();
  const expectedPass = env.APP_PASSWORD || 'nsd2026';

  const inputUser = String(body.username || '').trim().toLowerCase();
  const inputPass = String(body.password || '');

  if (inputUser === expectedUser && inputPass === expectedPass) {
    const tokenPayload = `${inputUser}:${Date.now()}`;
    const token = btoa(tokenPayload);
    return new Response(JSON.stringify({ ok: true, user: inputUser, token }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify({ error: 'Kredensial tidak valid' }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' }
  });
}
