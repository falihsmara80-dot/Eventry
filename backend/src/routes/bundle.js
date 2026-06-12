const express = require('express');
const { generateBundle } = require('../controllers/bundleController');

const router = express.Router();

router.post('/generate', generateBundle);

module.exports = router;
