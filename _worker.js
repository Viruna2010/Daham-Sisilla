export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // ===========================
    // 1. Generate Content
    // ===========================
    if (url.pathname === "/api/generate-content" && request.method === "POST") {
      try {
        const promptStr = `Act as an expert Content Creator. Provide a JSON array containing exactly 10 historical Sri Lankan scenes (1950-1980). Return ONLY a valid JSON array of objects without markdown.
Format: [{"title":"Sinhala Title","share_text":"Sinhala Share Text","image_prompt":"English highly detailed vintage photography prompt for Imagen 4 Ultra. Use keywords: historical, realistic, cinematic","video_title":"Sinhala YT Title","tags":"#Tags"}]`;

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${env.GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: promptStr
                    }
                  ]
                }
              ]
            })
          }
        );

        const data = await response.json();

        return new Response(JSON.stringify(data), {
          status: response.status,
          headers: {
            "Content-Type": "application/json"
          }
        });

      } catch (err) {
        return new Response(
          JSON.stringify({
            error: err.message
          }),
          {
            status: 500,
            headers: {
              "Content-Type": "application/json"
            }
          }
        );
      }
    }

    // ===========================
    // 2. Generate Image
    // ===========================
    if (url.pathname === "/api/generate-image" && request.method === "POST") {

      try {

        const body = await request.json();

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-ultra-generate-001:predict?key=${env.GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              instances: [
                {
                  prompt: body.prompt
                }
              ],
              parameters: {
                sampleCount: 1
              }
            })
          }
        );

        const data = await response.json();

        return new Response(JSON.stringify(data), {
          status: response.status,
          headers: {
            "Content-Type": "application/json"
          }
        });

      } catch (err) {

        return new Response(
          JSON.stringify({
            error: err.message
          }),
          {
            status: 500,
            headers: {
              "Content-Type": "application/json"
            }
          }
        );

      }

    }

    // ===========================
    // Static Files
    // ===========================
    return env.ASSETS.fetch(request);
  }
};
