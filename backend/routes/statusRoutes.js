const express = require('express');
const router = express.Router();
const { getGazStatus, getNgStatus } = require('../controllers/statuscontroller');

router.post('/gazetted', getGazStatus);
router.post('/nongazetted', getNgStatus);

module.exports = router;
