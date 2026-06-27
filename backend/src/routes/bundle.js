const express = require('express');
const { generateBundle, selectBundles } = require('../controllers/bundleController');

const router = express.Router();

router.post('/generate', generateBundle);
router.post('/select', selectBundles);

module.exports = router;
