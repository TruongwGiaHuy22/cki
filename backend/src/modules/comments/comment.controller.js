const { createCommentSchema, updateCommentSchema } = require("./comment.validator");
const service = require("./comment.service");

async function getCommentsByNovel(req, res, next) {
  try {
    const idln = Number(req.params.idln);
    const limit = Number(req.query.limit) || 20;
    const offset = Number(req.query.offset) || 0;
    const userId = req.user?.sub || null;

    if (isNaN(idln) || idln <= 0) {
      return res.status(400).json({ success: false, message: "Invalid novel ID" });
    }

    const data = await service.getCommentsByNovel(idln, limit, offset, userId);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function createComment(req, res, next) {
  try {
    if (!req.user || !req.user.sub) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const payload = createCommentSchema.parse(req.body);
    const data = await service.createComment(payload, req.user.sub);
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function updateComment(req, res, next) {
  try {
    if (!req.user || !req.user.sub) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const commentId = Number(req.params.id);
    const payload = updateCommentSchema.parse(req.body);

    if (isNaN(commentId) || commentId <= 0) {
      return res.status(400).json({ success: false, message: "Invalid comment ID" });
    }

    const data = await service.updateComment(commentId, req.user.sub, payload);
    res.json({ success: true, data });
  } catch (err) {
    if (err.message === "Unauthorized") {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }
    next(err);
  }
}

async function deleteComment(req, res, next) {
  try {
    if (!req.user || !req.user.sub) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const commentId = Number(req.params.id);

    if (isNaN(commentId) || commentId <= 0) {
      return res.status(400).json({ success: false, message: "Invalid comment ID" });
    }

    const data = await service.deleteComment(commentId, req.user.sub);
    res.json({ success: true, data });
  } catch (err) {
    if (err.message === "Unauthorized") {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }
    next(err);
  }
}

async function likeComment(req, res, next) {
  try {
    if (!req.user || !req.user.sub) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const commentId = Number(req.params.id);

    if (isNaN(commentId) || commentId <= 0) {
      return res.status(400).json({ success: false, message: "Invalid comment ID" });
    }

    const data = await service.likeComment(commentId, req.user.sub);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function getRecentComments(req, res, next) {
  try {
    const limit = Number(req.query.limit) || 3;

    const data = await service.getRecentComments(limit);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getCommentsByNovel,
  createComment,
  updateComment,
  deleteComment,
  likeComment,
  getRecentComments,
};
