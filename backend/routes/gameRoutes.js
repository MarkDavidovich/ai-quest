const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');
const verifyToken = require('../middleware/verifyToken');

router.post('/save', verifyToken, gameController.saveGameState);
router.get('/load', verifyToken, gameController.loadGameState);

module.exports = router;