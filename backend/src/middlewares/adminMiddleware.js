const isAdmin = (req, res, next) => {
    // Giả sử req.user được gán từ JWT token sau khi đăng nhập
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: "Bạn không có quyền truy cập!" });
    }
};
module.exports = isAdmin;