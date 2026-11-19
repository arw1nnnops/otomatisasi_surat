export async function onRequestPost(context) {
  const { request, env } = context;
  if (!env.GEMINI_API_KEY) {
    return new Response(JSON.stringify({ error: 'GEMINI_API_KEY belum diatur di Cloudflare Pages' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const body = await request.json();
  const model = body.model || env.GEMINI_MODEL || 'gemini-4-hydrogen';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(env.GEMINI_API_KEY)}`;

  const upstream = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body.payload)
  });

  const data = await upstream.text();
  return new Response(data, {
    status: upstream.status,
    headers: { 'Content-Type': 'application/json' }
  });
}
