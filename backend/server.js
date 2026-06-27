require('dotenv').config({ quiet: true });

const express = require('express');
const cors = require('cors');

const healthRoutes = require('./src/routes/healthRoutes');
const bundleRoutes = require('./src/routes/bundle');
const checkoutRoutes = require('./src/routes/checkout');
const agentRoutes = require('./src/routes/agent');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api', healthRoutes);
app.use('/api/bundle', bundleRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/agent', agentRoutes);

const server = app.listen(PORT, () => {
  console.log(`BundleAI backend listening on http://localhost:${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(
      `Port ${PORT} is already in use. On macOS this is often the AirPlay ` +
      `Receiver (System Settings > General > AirDrop & Handoff). ` +
      `Set PORT=<another_port> in .env to use a different port.`
    );
  } else {
    console.error('Server failed to start:', err);
  }
  process.exit(1);
});
