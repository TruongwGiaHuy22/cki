const service = require("./chapter.service");

exports.detail = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const chapter = await service.detail(id);
    res.json({ success: true, data: chapter });
  } catch (e) { next(e); }
};
