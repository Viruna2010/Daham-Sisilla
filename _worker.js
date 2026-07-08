export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 1. Text Generate කිරීම (Gemini 3.1 Flash Lite - Models format updated)
    if (url.pathname === "/api/generate-content" && request.method === "POST") {
      const promptStr = `Act as an expert Content Creator. Provide a JSON array containing exactly 10 historical Sri Lankan scenes (1950-1980). Return ONLY a valid JSON array of objects without markdown.
      Format: [{"title": "Sinhala Title", "share_text": "Sinhala Share Text", "image_prompt": "English highly detailed vintage photography prompt for Imagen 4 Ultra. Use keywords: historical, realistic, cinematic", "video_title": "Sinhala YT Title", "tags": "#Tags"}]`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${env.GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: promptStr }] }] })
      });
      const data = await response.json();
      return new Response(JSON.stringify(data), { headers: { "Content-Type": "application/json" } });
    }

    // 2. Image Generate කිරීම (Imagen 4 Ultra via Gemini API)
    if (url.pathname === "/api/generate-image" && request.method === "POST") {
      const body = await request.json();
      
      // Google Generative Language API හරහා Imagen 4 Ultra වෙත Request එක යැවීම
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-ultra-generate-001:predict?key=${env.GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instances: [{ prompt: body.prompt }],
          parameters: { sampleCount: 1 }
        })
      });
      const data = await response.json();
      return new Response(JSON.stringify(data), { headers: { "Content-Type": "application/json" } });
    }

    // වෙනත් ඕනෑම Request එකක් සඳහා සාමාන්‍ය පරිදි කටයුතු කිරීම (Serving index.html)
    return env.ASSETS.fetch(request);
  }
};
