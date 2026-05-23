import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu không khớp!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:4000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Đăng ký thất bại");
      }
      navigate("/login");
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Đăng ký tài khoản</h2>

        <p>
          Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
        </p>

        <label>
          Tên đăng nhập *
          <input type="text" name="username" value={formData.username} onChange={handleChange} required />
        </label>

        <label>
          Địa chỉ E-Mail *
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </label>

        <label>
          Mật khẩu *
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </label>

        <label>
          Xác nhận mật khẩu *
          <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
        </label>

        <div className="register-captcha">
          <input type="checkbox" required /> Tôi không phải là người máy
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Đang đăng ký..." : "Đăng Ký"}
        </button>
        {error && <p style={{ color: "#fca5a5", margin: 0 }}>{error}</p>}
      </form>
    </div>
  );
}
