const service = require("./chapter.service");

// Lấy tất cả chapters của một truyện
exports.listByNovel = async (req, res, next) => {
  try {
    const novelId = Number(req.params.novelId);
    if (isNaN(novelId) || novelId <= 0) {
      return res.status(400).json({ success: false, message: "Invalid novel ID" });
    }
    const chapters = await service.listByNovel(novelId);
    res.json({ success: true, data: chapters });
  } catch (e) { next(e); }
};

exports.detail = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ success: false, message: "Invalid chapter ID" });
    }
    const chapter = await service.detail(id);
    if (!chapter) {
      return res.status(404).json({ success: false, message: "Chapter not found" });
    }
    res.json({ success: true, data: chapter });
  } catch (e) { next(e); }
};

exports.update = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ success: false, message: "Invalid chapter ID" });
    }
    const data = req.body || {};
    const chapter = await service.update(id, data);
    res.json({ success: true, data: chapter });
  } catch (e) { next(e); }
};
