import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { message } = await request.json();
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const chunks = [
        "Connecting to OpenClaw tools...\n",
        `Received: ${message}\n`,
        "Streaming placeholder response.\n",
      ];

      for (const chunk of chunks) {
        controller.enqueue(encoder.encode(chunk));
        await new Promise((resolve) => setTimeout(resolve, 250));
      }
      controller.close();
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
