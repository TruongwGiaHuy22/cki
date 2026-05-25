const forumService = require('./forum.service');

exports.createPost = async (req, res) => {
  try {
    const user_id = req.user?.sub; 
    const { title, content, category } = req.body;

    if (!user_id) {
      return res.status(401).json({ success: false, message: "Bạn cần đăng nhập!" });
    }

    if (!title || !content) {
      return res.status(400).json({ success: false, message: "Thiếu dữ liệu bắt buộc!" });
    }

    const post = await forumService.createPost({ 
      user_id, 
      title, 
      content, 
      category, 
      idln: null 
    });

    return res.status(201).json({ success: true, data: post });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const { category } = req.query; 
    const posts = await forumService.getAllPosts(category);
    return res.json({ success: true, data: posts || [] });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const post = await forumService.getPostById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: "Không tìm thấy bài viết!" });
    }
    return res.json({ success: true, data: post });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getComments = async (req, res) => {
  try {
    const comments = await forumService.getCommentsByPostId(req.params.id);
    return res.json({ success: true, data: comments || [] });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.createComment = async (req, res) => {
  try {
    const user_id = req.user?.sub;
    const { post_id, parent_id, content } = req.body;

    if (!user_id) {
      return res.status(401).json({ success: false, message: "Vui lòng đăng nhập!" });
    }

    if (!content || content.trim() === "") {
      return res.status(400).json({ success: false, message: "Nội dung trống!" });
    }

    const comment = await forumService.createComment({ 
      post_id, 
      user_id, 
      parent_id, 
      content 
    });

    return res.status(201).json({ success: true, data: comment });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const user_id = req.user?.sub;
    const { id } = req.params;
    const { title, content, category } = req.body;

    if (!user_id) {
      return res.status(401).json({ success: false, message: "Bạn cần đăng nhập!" });
    }

    if (!title || !content) {
      return res.status(400).json({ success: false, message: "Tiêu đề và nội dung không được để trống!" });
    }

    const post = await forumService.updatePost(id, user_id, { title, content, category });
    
    if (!post) {
      return res.status(403).json({ success: false, message: "Bạn không có quyền chỉnh sửa bài viết này!" });
    }

    return res.json({ success: true, data: post });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const user_id = req.user?.sub;
    const { id } = req.params;

    if (!user_id) {
      return res.status(401).json({ success: false, message: "Bạn cần đăng nhập!" });
    }

    const result = await forumService.deletePost(id, user_id);
    
    if (!result) {
      return res.status(403).json({ success: false, message: "Bạn không có quyền xóa bài viết này!" });
    }

    return res.json({ success: true, message: "Bài viết đã được xóa!" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};