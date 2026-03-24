const express = require('express');
const router = express.Router();
const { chatWithNpc } = require('../controllers/npcDialogueController');

router.post('/chat', chatWithNpc);

module.exports = router;