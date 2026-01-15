import type { Server as HttpServer } from "http";
import { WebSocketServer } from "ws";

export function setupEvaluationWebSocket(server: HttpServer): void {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws, req) => {
    const url = req.url || "";
    const match = url.match(/^\/api\/sessions\/([^/]+)\/stream/);
    if (!match) {
      ws.close();
      return;
    }

    const sessionId = match[1];
    console.log(`WebSocket connected for session ${sessionId}`);

    // Send a few mock evaluation updates, then close
    let progress = 0;
    const interval = setInterval(() => {
      progress += 25;
      const payload = {
        sessionId,
        overallScore: 60 + Math.floor(Math.random() * 40),
        feedback: "Live mock evaluation in progress...",
        strengths: ["Clear explanation"],
        improvements: ["Add more concrete examples"]
      };
      ws.send(JSON.stringify(payload));

      if (progress >= 100) {
        clearInterval(interval);
        ws.close();
      }
    }, 1000);

    ws.on("close", () => {
      clearInterval(interval);
      console.log(`WebSocket closed for session ${sessionId}`);
    });
  });
}

