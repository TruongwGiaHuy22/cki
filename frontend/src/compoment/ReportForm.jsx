import React, { useState } from "react";

export default function ReportForm() {
  const [formData, setFormData] = useState({
    reason: "",
    description: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!token) {
      setMessage("⚠️ Vui lòng đăng nhập để báo lỗi");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    if (!formData.reason.trim()) {
      setMessage("⚠️ Vui lòng chọn loại báo cáo");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:4000/api/reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          reason: formData.reason,
          description: formData.description || formData.reason
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ Báo cáo của bạn đã được gửi thành công! Admin sẽ xử lý sớm.");
        setFormData({ reason: "", description: "" });
        setTimeout(() => setMessage(""), 5000);
      } else {
        setMessage(`❌ ${data.message || "Lỗi khi gửi báo cáo"}`);
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      setMessage("❌ Lỗi kết nối: " + error.message);
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formBox}>
        <div style={styles.header}>
          <h3 style={styles.title}>🐛 Gửi Báo Cáo Lỗi / Góp Ý Ngay</h3>
          <p style={styles.subtitle}>Giúp chúng tôi cải thiện hệ thống</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Loại báo cáo *</label>
            <select 
              name="reason" 
              value={formData.reason} 
              onChange={handleChange}
              style={styles.select}
            >
              <option value="">-- Chọn loại --</option>
              <option value="Lỗi hiển thị">Lỗi hiển thị</option>
              <option value="Lỗi tính năng">Lỗi tính năng</option>
              <option value="Nội dung không phù hợp">Nội dung không phù hợp</option>
              <option value="Spam">Spam</option>
              <option value="Góp ý cải thiện">Góp ý cải thiện</option>
              <option value="Khác">Khác</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Chi tiết (tùy chọn)</label>
            <textarea 
              name="description" 
              value={formData.description} 
              onChange={handleChange}
              placeholder="Mô tả chi tiết về lỗi hoặc góp ý của bạn..."
              style={styles.textarea}
              rows="4"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{
              ...styles.submitBtn,
              opacity: loading ? 0.6 : 1,
              cursor: loading ? "not-allowed" : "pointer"
            }}
          >
            {loading ? "⏳ Đang gửi..." : "📤 Gửi báo cáo"}
          </button>
        </form>

        {message && (
          <div style={{
            ...styles.message,
            backgroundColor: message.includes("✅") ? "rgba(34, 197, 94, 0.15)" : "rgba(239, 68, 68, 0.15)",
            borderColor: message.includes("✅") ? "rgba(34, 197, 94, 0.3)" : "rgba(239, 68, 68, 0.3)",
            color: message.includes("✅") ? "#86efac" : "#fca5a5"
          }}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: "100%",
    background: "linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.8))",
    padding: "2rem 1rem",
    marginTop: "2rem",
    borderTop: "2px solid #2e3340"
  },
  formBox: {
    maxWidth: "600px",
    margin: "0 auto",
    background: "#1f222a",
    border: "1px solid #2e3340",
    borderRadius: "0.5rem",
    padding: "1.5rem",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)"
  },
  header: {
    marginBottom: "1.5rem",
    textAlign: "center"
  },
  title: {
    margin: "0 0 0.5rem 0",
    fontSize: "1.2rem",
    color: "#f8fafc",
    fontWeight: "700"
  },
  subtitle: {
    margin: 0,
    fontSize: "0.9rem",
    color: "#94a3b8"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1.2rem"
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem"
  },
  label: {
    fontWeight: "600",
    color: "#cbd5e1",
    fontSize: "0.95rem"
  },
  select: {
    padding: "0.75rem",
    border: "1px solid #2e3340",
    borderRadius: "0.375rem",
    fontFamily: "inherit",
    fontSize: "0.95rem",
    background: "#181a20",
    color: "#cbd5e1",
    transition: "all 0.2s",
    cursor: "pointer",
    outline: "none"
  },
  textarea: {
    padding: "0.75rem",
    border: "1px solid #2e3340",
    borderRadius: "0.375rem",
    fontFamily: "inherit",
    fontSize: "0.95rem",
    background: "#181a20",
    color: "#cbd5e1",
    resize: "vertical",
    minHeight: "100px",
    transition: "all 0.2s",
    outline: "none"
  },
  submitBtn: {
    padding: "0.9rem 1.5rem",
    background: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: "0.375rem",
    fontWeight: "600",
    fontSize: "1rem",
    transition: "all 0.2s",
    marginTop: "0.5rem"
  },
  message: {
    padding: "0.75rem 1rem",
    borderRadius: "0.375rem",
    fontSize: "0.95rem",
    border: "1px solid",
    animation: "slideDown 0.3s ease"
  }
};
