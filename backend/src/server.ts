import http from "http";
import app from "./app";
import { env } from "./config/env";
import { setupEvaluationWebSocket } from "./ws/evaluationStream";

const server = http.createServer(app);

// Attach WebSocket server for real-time evaluation stream
setupEvaluationWebSocket(server);

server.listen(env.PORT, () => {
  console.log(`Backend listening on http://localhost:${env.PORT}`);
});

export default server;

