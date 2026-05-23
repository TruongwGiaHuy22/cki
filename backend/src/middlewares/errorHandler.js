function errorHandler(err, req, res, next) {
  if (err && err.name === "ZodError" && Array.isArray(err.issues)) {
    const firstIssue = err.issues[0];
    const field = firstIssue?.path?.[0];
    let message = "Dữ liệu không hợp lệ";

    if (field === "password") {
      message = "Bạn đã nhập sai mật khẩu";
    } else if (field === "identifier") {
      message = "Email hoặc tên đăng nhập không hợp lệ";
    } else if (typeof firstIssue?.message === "string" && firstIssue.message.trim()) {
      message = firstIssue.message;
    }

    return res.status(400).json({
      success: false,
      message,
      field,
    });
  }

  const status = err.status || 500;
  const message = err.message || "Internal server error";

  if (status >= 500) {
    console.error(err);
  }

  res.status(status).json({
    success: false,
    message,
  });
}

module.exports = errorHandler;
