import express from 'express';
import { createServer } from 'node:http';
import { WebSocketServer } from 'ws';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server, path: '/ws' });

const PORT = Number(process.env.PORT || 3000);
const clients = new Set();

app.disable('x-powered-by');
app.use(express.json({ limit: '64kb' }));
app.use(express.static(__dirname));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'nuclear-gods-eye', stage: 1 });
});

wss.on('connection', (socket) => {
  clients.add(socket);
  socket.send(JSON.stringify({ type: 'game:hello', stage: 1 }));

  socket.on('message', (raw) => {
    let message;
    try {
      message = JSON.parse(raw.toString());
    } catch {
      return;
    }

    // Stage 1 only establishes a safe event transport. Game rules are added later.
    const payload = JSON.stringify({
      type: 'game:event',
      event: message?.type || 'unknown',
      data: message?.data ?? null,
    });

    for (const peer of clients) {
      if (peer.readyState === 1) peer.send(payload);
    }
  });

  socket.on('close', () => clients.delete(socket));
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Nuclear God's Eye server listening on ${PORT}`);
});
