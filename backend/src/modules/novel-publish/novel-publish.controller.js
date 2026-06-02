const service = require("./novel-publish.service");

async function create(req, res, next) {
  try {
    const payload = req.body;
    
    if (!payload.idln || !payload.buy_link) {
      return res.status(400).json({ 
        success: false, 
        message: "Missing required fields: idln, buy_link" 
      });
    }

    const data = await service.create(payload, req.user?.sub);
    res.status(201).json({ success: true, data });
  } catch (err) {
    if (err && err.statusCode) {
      return res.status(err.statusCode).json({ success: false, message: err.message });
    }
    next(err);
  }
}

async function getByNovelId(req, res, next) {
  try {
    const idln = Number(req.params.idln);
    if (isNaN(idln) || idln <= 0) {
      return res.status(400).json({ success: false, message: "Invalid novel ID" });
    }
    
    const data = await service.getByNovelId(idln);
    res.json({ success: true, data });
  } catch (err) {
    if (err && err.statusCode) {
      return res.status(err.statusCode).json({ success: false, message: err.message });
    }
    next(err);
  }
}


async function update(req, res, next) {
  try {
    const publish_id = Number(req.params.publish_id);
    if (isNaN(publish_id) || publish_id <= 0) {
      return res.status(400).json({ success: false, message: "Invalid publish ID" });
    }
    
    const payload = req.body;
    const data = await service.update(publish_id, payload, req.user?.sub);
    
    if (!data) {
      return res.status(404).json({ success: false, message: "Publish info not found" });
    }
    
    res.json({ success: true, data });
  } catch (err) {
    if (err && err.statusCode) {
      return res.status(err.statusCode).json({ success: false, message: err.message });
    }
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const publish_id = Number(req.params.publish_id);
    if (isNaN(publish_id) || publish_id <= 0) {
      return res.status(400).json({ success: false, message: "Invalid publish ID" });
    }
    
    const ok = await service.remove(publish_id, req.user?.sub);
    if (!ok) {
      return res.status(404).json({ success: false, message: "Publish info not found" });
    }
    
    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    if (err && err.statusCode) {
      return res.status(err.statusCode).json({ success: false, message: err.message });
    }
    next(err);
  }
}

module.exports = { create, getByNovelId, update, remove };
