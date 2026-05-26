const { createNovelSchema, updateNovelSchema } = require("./novel.validator");
const service = require("./novel.service");

async function list(req, res, next) {
  try {
    const data = await service.list();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function listByUser(req, res, next) {
  try {
    console.log("🔍 listByUser called");
    console.log("🔍 req.user:", req.user);
    
    const userId = Number(req.user?.sub);
    console.log("🔍 userId:", userId, "typeof:", typeof userId);
    
    if (!userId || isNaN(userId)) {
      return res.status(400).json({ success: false, message: "User ID not found or invalid" });
    }
    const data = await service.listByUser(userId);
    console.log("🔍 listByUser - Found novels:", data.length, "for user", userId);
    res.json({ success: true, data });
  } catch (err) {
    console.log("❌ Error in listByUser:", err.message);
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ success: false, message: "Invalid novel ID" });
    }
    const data = await service.getById(id);
    if (!data) return res.status(404).json({ success: false, message: "Novel not found" });
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const payload = createNovelSchema.parse(req.body);
    const data = await service.create(payload, req.user?.sub || null);
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ success: false, message: "Invalid novel ID" });
    }
    const payload = updateNovelSchema.parse(req.body);
    const data = await service.update(id, payload);
    if (!data) return res.status(404).json({ success: false, message: "Novel not found" });
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ success: false, message: "Invalid novel ID" });
    }
    const ok = await service.remove(id);
    if (!ok) return res.status(404).json({ success: false, message: "Novel not found" });
    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    next(err);
  }
}

async function detail(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ success: false, message: "Invalid novel ID" });
    }
    const data = await service.detail(id);
    if (!data) return res.status(404).json({ success: false, message: "Novel not found" });
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function chapters(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ success: false, message: "Invalid novel ID" });
    }
    const data = await service.chapters(id);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function createVolume(req, res, next) {
  try {
    const id = Number(req.params.id);
    const data = await service.createVolume(id, req.body || {});
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function createChapter(req, res, next) {
  try {
    const id = Number(req.params.id);
    const data = await service.createChapter(id, req.body || {});
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function deleteVolume(req, res, next) {
  try {
    const volumeId = Number(req.params.volumeId);
    if (isNaN(volumeId) || volumeId <= 0) {
      return res.status(400).json({ success: false, message: "Invalid volume ID" });
    }
    const ok = await service.deleteVolume(volumeId);
    if (!ok) return res.status(404).json({ success: false, message: "Volume not found" });
    res.json({ success: true, message: "Volume deleted successfully" });
  } catch (err) {
    next(err);
  }
}

async function deleteChapter(req, res, next) {
  try {
    const chapterId = Number(req.params.chapterId);
    if (isNaN(chapterId) || chapterId <= 0) {
      return res.status(400).json({ success: false, message: "Invalid chapter ID" });
    }
    const ok = await service.deleteChapter(chapterId);
    if (!ok) return res.status(404).json({ success: false, message: "Chapter not found" });
    res.json({ success: true, message: "Chapter deleted successfully" });
  } catch (err) {
    next(err);
  }
}

async function search(req, res, next) {
  try {
    const keyword = req.query.q || "";
    const data = await service.searchByTitle(keyword);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

async function incrementView(req, res, next) {
  try {
    const id = Number(req.params.id);
    const userId = req.user?.sub || null;
    
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ success: false, message: "Invalid novel ID" });
    }
    
    const ok = await service.incrementView(id, userId);
    if (!ok) return res.status(404).json({ success: false, message: "Novel not found" });
    res.json({ success: true, message: "View incremented" });
  } catch (err) {
    next(err);
  }
}

module.exports = { list, listByUser, getById, create, update, remove, detail, chapters, createVolume, createChapter, deleteVolume, deleteChapter, search, incrementView };