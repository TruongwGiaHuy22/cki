const express = require('express');
const router = express.Router();
const historyController = require('./history.controller');
const verifyToken = require('../../middlewares/authRequired');

router.get('/', verifyToken, historyController.getHistory);
router.post('/', verifyToken, historyController.addHistory);
module.exports = router;