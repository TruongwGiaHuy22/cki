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

async function getById(req, res, next) {
  try {
    const id = Number(req.params.id);
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

module.exports = { list, getById, create, update, remove, detail, chapters, createVolume, createChapter };
