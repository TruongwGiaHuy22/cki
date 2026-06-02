const express = require('express');
const router = express.Router();
const bookmarkController = require('./bookmark.controller');
const verifyToken = require('../../middlewares/authRequired');

router.get('/', verifyToken, bookmarkController.getBookmarks);
router.get('/check/:idln', verifyToken, bookmarkController.checkBookmark);
router.post('/', verifyToken, bookmarkController.addBookmark);
router.delete('/', verifyToken, bookmarkController.removeBookmark);

module.exports = router;
