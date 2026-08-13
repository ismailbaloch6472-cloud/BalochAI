export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/chat" && request.method === "POST") {
      try {
        const body = await request.json();
        const message = body.message || "";

        if (!message.trim()) {
          return Response.json(
            { error: "Message is required" },
            { status: 400 }
          );
        }

        const result = await env.AI.run(
          "@cf/meta/llama-3.1-8b-instruct-fast",
          {
            messages: [
              {
                role: "system",
                content:
                  "You are BalochAI, a helpful AI assistant. Reply clearly and helpfully in the same language as the user."
              },
              {
                role: "user",
                content: message
              }
            ]
          }
        );

        return Response.json({
          success: true,
          response: result.response
        });

      } catch (error) {
        return Response.json({
          success: false,
          error: String(error)
        }, { status: 500 });
      }
    }

    return env.ASSETS.fetch(request);
  }
};
