import { useState } from "react";
import { Link } from "react-router-dom";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
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
      } else {
        sessionStorage.setItem("token", data.data.token);
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

            <button type="button" className="login-link-btn">
              Quên mật khẩu?
            </button>
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
          {error && <p style={{ color: "#fca5a5", margin: 0 }}>{error}</p>}
          {message && <p style={{ color: "#86efac", margin: 0 }}>{message}</p>}
        </form>

        <div className="login-social">
          <p>Hoặc đăng nhập bằng</p>
          <button type="button" className="login-google">Google</button>
        </div>

        <p className="login-note">Lưu ý: Facebook không còn hỗ trợ đăng nhập.</p>

        <p className="login-register-link">
          Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
        </p>
      </div>
    </div>
  );
}
