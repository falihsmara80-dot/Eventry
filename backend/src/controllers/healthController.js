function getHealth(req, res) {
  res.json({
    status: 'ok',
    service: 'bundleai-backend',
    timestamp: new Date().toISOString(),
  });
}

module.exports = { getHealth };
