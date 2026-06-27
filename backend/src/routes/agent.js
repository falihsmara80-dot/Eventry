const express = require('express');
const { planWithAgent } = require('../controllers/agentController');

const router = express.Router();

router.post('/plan', planWithAgent);

module.exports = router;
