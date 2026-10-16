
export async function onRequestPost({ request }) {
  try {
    const body = await request.json();
    const base =
      "https://numanajmal0-wan-video-api.hf.space";

    // Check generation status
    if (body.event_id) {
      const res = await fetch(
        `${base}/gradio_api/call/generate/${encodeURIComponent(body.event_id)}`
      );
      const result = await res.text();

      return new Response(result, {
        status: res.status,
        headers: { "Content-Type": "text/event-stream" }
      });
    }

    if (!body.prompt?.trim()) {
      return Response.json(
        { error: "Please enter a video prompt." },
        { status: 400 }
      );
    }

    const res = await fetch(
      `${base}/gradio_api/call/v2/generate`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: [
            "wan-base",
            body.prompt,
            body.negative_prompt || "",
            body.width || 832,
            body.height || 480,
            body.num_frames || 21,
            body.steps || 20,
            body.guidance_scale || 5,
            body.seed ?? -1,
            body.lora_scale ?? 1,
            body.custom_ckpt || ""
          ]
        })
      }
    );

    const result = await res.text();

    return new Response(result, {
      status: res.status,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return Response.json(
      { error: "Video API request failed." },
      { status: 500 }
    );
  }
}
