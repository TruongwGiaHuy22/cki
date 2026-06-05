import { useState } from "react";
import { Link } from "react-router-dom";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [forgotData, setForgotData] = useState({
    username: "",
    email: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleForgotChange = (e) => {
    const { name, value } = e.target;
    setForgotData({
      ...forgotData,
      [name]: value,
    });
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setForgotError("");
    setForgotMessage("");
    setForgotLoading(true);

    if (forgotData.newPassword !== forgotData.confirmPassword) {
      setForgotError("Mật khẩu mới không khớp");
      setForgotLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: forgotData.username,
          email: forgotData.email,
          oldPassword: forgotData.oldPassword,
          newPassword: forgotData.newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Lỗi đổi mật khẩu");
      }

      setForgotMessage("✅ Đổi mật khẩu thành công! Vui lòng đăng nhập lại.");
      setForgotData({
        username: "",
        email: "",
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setTimeout(() => {
        setShowForgotModal(false);
      }, 2000);
    } catch (err) {
      setForgotError(err.message || "Có lỗi xảy ra");
    } finally {
      setForgotLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        const rawMessage = data?.message;
        const textMessage =
          typeof rawMessage === "string" ? rawMessage : JSON.stringify(rawMessage || "");
        if (textMessage.includes("too_small") || textMessage.includes("password")) {
          throw new Error("Bạn đã nhập sai mật khẩu");
        }
        throw new Error(textMessage || "Đăng nhập thất bại");
      }

        if (formData.remember) {
          localStorage.setItem("token", data.data.token);
          localStorage.setItem("user", JSON.stringify(data.data.user));
        } else {
          sessionStorage.setItem("token", data.data.token);
          sessionStorage.setItem("user", JSON.stringify(data.data.user));
        }

      setMessage("Đăng nhập thành công");
      window.location.href = "/";
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-box">
        <h2 className="login-title">Đăng nhập</h2>

        <form onSubmit={handleSubmit} className="login-form">
          <label className="login-label">
            Email hoặc Tên đăng nhập
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="login-input"
              required
            />
          </label>

          <label className="login-label">
            Mật khẩu
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="login-input"
              required
            />
          </label>

          <div className="login-options">
            <label className="login-remember">
              <input
                type="checkbox"
                name="remember"
                checked={formData.remember}
                onChange={handleChange}
              />
              Ghi nhớ
            </label>

            <button type="button" className="login-link-btn" onClick={() => setShowForgotModal(true)}>
              Quên mật khẩu?
            </button>
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
          {error && <p style={{ color: "#fca5a5", margin: 0 }}>{error}</p>}
          {message && <p style={{ color: "#86efac", margin: 0 }}>{message}</p>}
        </form>

        <p className="login-note">Lưu ý: Facebook không còn hỗ trợ đăng nhập.</p>

        <p className="login-register-link">
          Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
        </p>
      </div>

      {showForgotModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: "#fff",
            borderRadius: "8px",
            padding: "30px",
            maxWidth: "500px",
            width: "90%",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)"
          }}>
            <h2 style={{ marginTop: 0 }}>Đổi mật khẩu</h2>
            <form onSubmit={handleForgotSubmit}>
              <label style={{ display: "block", marginBottom: "15px" }}>
                Tên người dùng
                <input
                  type="text"
                  name="username"
                  value={forgotData.username}
                  onChange={handleForgotChange}
                  placeholder="Nhập tên người dùng"
                  style={{
                    width: "100%",
                    padding: "10px",
                    marginTop: "5px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    boxSizing: "border-box",
                    fontSize: "14px"
                  }}
                  required
                />
              </label>

              <label style={{ display: "block", marginBottom: "15px" }}>
                Email
                <input
                  type="email"
                  name="email"
                  value={forgotData.email}
                  onChange={handleForgotChange}
                  placeholder="Nhập email"
                  style={{
                    width: "100%",
                    padding: "10px",
                    marginTop: "5px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    boxSizing: "border-box",
                    fontSize: "14px"
                  }}
                  required
                />
              </label>

              <label style={{ display: "block", marginBottom: "15px" }}>
                Mật khẩu cũ
                <input
                  type="password"
                  name="oldPassword"
                  value={forgotData.oldPassword}
                  onChange={handleForgotChange}
                  placeholder="Nhập mật khẩu cũ"
                  style={{
                    width: "100%",
                    padding: "10px",
                    marginTop: "5px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    boxSizing: "border-box",
                    fontSize: "14px"
                  }}
                  required
                />
              </label>

              <label style={{ display: "block", marginBottom: "15px" }}>
                Mật khẩu mới
                <input
                  type="password"
                  name="newPassword"
                  value={forgotData.newPassword}
                  onChange={handleForgotChange}
                  placeholder="Nhập mật khẩu mới"
                  style={{
                    width: "100%",
                    padding: "10px",
                    marginTop: "5px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    boxSizing: "border-box",
                    fontSize: "14px"
                  }}
                  required
                />
              </label>

              <label style={{ display: "block", marginBottom: "15px" }}>
                Xác nhận mật khẩu mới
                <input
                  type="password"
                  name="confirmPassword"
                  value={forgotData.confirmPassword}
                  onChange={handleForgotChange}
                  placeholder="Xác nhận mật khẩu mới"
                  style={{
                    width: "100%",
                    padding: "10px",
                    marginTop: "5px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    boxSizing: "border-box",
                    fontSize: "14px"
                  }}
                  required
                />
              </label>

              {forgotError && <p style={{ color: "#ef4444", fontSize: "14px" }}>{forgotError}</p>}
              {forgotMessage && <p style={{ color: "#22c55e", fontSize: "14px" }}>{forgotMessage}</p>}

              <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  style={{
                    flex: 1,
                    padding: "10px",
                    backgroundColor: "#3b82f6",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: forgotLoading ? "not-allowed" : "pointer",
                    fontSize: "14px",
                    fontWeight: "600"
                  }}
                >
                  {forgotLoading ? "Đang cập nhập..." : "Cập nhập mật khẩu"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  style={{
                    flex: 1,
                    padding: "10px",
                    backgroundColor: "#6b7280",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "600"
                  }}
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
