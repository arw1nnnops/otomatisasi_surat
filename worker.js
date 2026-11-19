export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Server-side AI endpoint using Cloudflare Secret GEMINI_API_KEY
    if (url.pathname === '/api/compose' && request.method === 'POST') {
      if (!env.GEMINI_API_KEY) {
        return new Response(
          JSON.stringify({ error: 'GEMINI_API_KEY belum ditambahkan di Cloudflare Settings -> Variables and Secrets.' }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }

      let body = {};
      try {
        body = await request.json();
      } catch (e) {
        return new Response(JSON.stringify({ error: 'Format permintaan tidak valid.' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const primary = env.GEMINI_MODEL || body.model || 'gemini-4-hydrogen';
      const models = [...new Set([primary, 'gemini-2.5-flash'])];

      let lastStatus = 500;
      let lastMsg = 'Gagal menghubungi Gemini API.';

      for (const modelId of models) {
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(modelId)}:generateContent?key=${encodeURIComponent(env.GEMINI_API_KEY)}`;
        const upstream = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body.payload)
        });

        if (upstream.ok) {
          const text = await upstream.text();
          return new Response(text, {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        lastStatus = upstream.status;
        const errText = await upstream.text().catch(() => '');
        lastMsg = `Model ${modelId} gagal (${upstream.status})${errText ? ': ' + errText.slice(0, 140) : ''}`;
        if (upstream.status === 401 || upstream.status === 403) {
          return new Response(JSON.stringify({ error: 'GEMINI_API_KEY di Cloudflare tidak valid.' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }

      return new Response(JSON.stringify({ error: lastMsg }), {
        status: lastStatus,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Serve static website files (index.html)
    return env.ASSETS.fetch(request);
  }
};
