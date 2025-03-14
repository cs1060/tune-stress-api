const express = require('express');
const path = require('path');
const WebSocket = require('ws');
const { createLoadTest } = require('./lib/loadTest');
const logger = require('./lib/logger');

const app = express();
const port = process.env.PORT || 3000;

// Serve static files
app.use(express.static('public'));
app.use(express.json());

// Health check endpoint for testing
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// WebSocket server for real-time updates
const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    const data = JSON.parse(message);
    logger.info(`Received: ${data}`);
  });
});

// API endpoints
app.post('/api/test', async (req, res) => {
  const { url, pattern, duration, requestsPerSecond } = req.body;
  
  if (!url || !pattern || !duration || !requestsPerSecond) {
    return res.status(400).json({ 
      error: 'Missing required parameters' 
    });
  }

  try {
    const test = createLoadTest({
      url,
      pattern,
      duration,
      requestsPerSecond
    });
    
    const results = await test.run();
    res.json(results);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: error.message });
  }
});

const server = app.listen(port, () => {
  logger.info(`StressAPI server running on port ${port}`);
});

// Attach WebSocket server to HTTP server
server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});