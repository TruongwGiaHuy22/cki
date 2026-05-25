import React from "react";
import { useNavigate } from "react-router-dom"; 

export default function ErrorReport() {
  const navigate = useNavigate(); 

  return (
    <div style={styles.container}>
      {/* Breadcrumb điều hướng */}
      <div style={styles.breadcrumb}>
        <button 
          style={styles.breadcrumbBtn} 
          onClick={() => navigate('/forum/create')} 
        >
          🏠 Thảo luận
        </button>
      </div>

      {/* Khối nội dung Góp ý và Báo lỗi */}
      <div style={styles.mainBox}>
        {/* Header của Khối */}
        <div style={styles.header}>
          <span style={{ marginRight: "0.5rem" }}>🛠️</span>
          <h2 style={styles.headerTitle}>Góp ý và báo lỗi hệ thống</h2>
        </div>

        {/* Vùng nội dung chi tiết */}
        <div style={styles.contentArea}>
          {/* Thông tin người đăng */}
          <div style={styles.userInfo}>
            <img 
              src="https://via.placeholder.com/150" 
              alt="Admin Avatar" 
              style={styles.avatar}
            />
            <div style={styles.userMeta}>
              <span style={styles.username}>giahuy</span>
              <span style={styles.roleBadge}>Administrator</span>
            </div>
            <span style={styles.timeText}>25/5/2026</span>
          </div>

          {/* Nội dung chi tiết */}
          <div style={styles.textContent}>
            <p style={styles.paragraph}>
              Chào toàn thể các cư dân trên hệ thống. Hiện tại, Cổng Light Novel vừa hoàn thành đợt cập nhật lớn toàn bộ mã nguồn frontend sang React và nâng cấp hệ thống cơ sở dữ liệu để tối ưu hóa tốc độ tải trang. 
            </p>
            
            <p style={styles.paragraph}>
              Do hệ thống vừa mới được triển khai lại trên môi trường localhost nên chắc chắn không thể tránh khỏi các lỗi phát sinh ngoài ý muốn (lỗi logic code, lỗi truy vấn SQL, hoặc hiển thị sai lệch giao diện CSS trên một số dòng máy). Vì vậy, Ban Quản Trị mở riêng topic này để làm nơi tiếp nhận mọi phản hồi, góp ý và báo lỗi từ phía các bạn nhằm mục đích sớm hoàn thiện trang web nhất có thể.
            </p>

            {/* Thông báo cập nhật fix lỗi khẩn cấp */}
            <div style={styles.alertBox}>
              <strong style={{ color: "#ef4444" }}>🚨 THÔNG BÁO FIX LỖI KHẨN CẤP (Cập nhật mới nhất):</strong>
              <p style={{ margin: "0.5rem 0 0 0", fontSize: "0.925rem", lineHeight: "1.6" }}>
                BQT vừa ghi nhận một số bạn gặp lỗi nghiêm trọng khi gửi bình luận hoặc phản hồi: <code style={styles.codeText}>"Error creating comment: Unknown column 'u.user_name' in 'field list'"</code>. <br />
                <strong>Nguyên nhân:</strong> Do câu lệnh <code style={styles.codeText}>JOIN</code> ở Backend gọi sai tên cột trong bảng <code style={styles.codeText}>users</code> (cột chính xác là <code style={styles.codeText}>username</code> chứ không phải <code style={styles.codeText}>user_name</code>). BQT đã tiến hành cập nhật lại script SQL trên server backend. Các bạn vui lòng <kbd style={styles.kbdText}>Ctrl + F5</kbd> lại trang web để kiểm tra nhé!
              </p>
            </div>

            <h3 style={styles.subTitle}>📌 Các Hạng Mục Cần Báo Lỗi</h3>
            <ul style={styles.featureList}>
              <li style={styles.featureItem}>
                <span style={styles.bullet}>•</span>
                <span><strong>Lỗi chức năng (Functional Bugs):</strong> Không thể đăng nhập/đăng ký, lỗi nhảy con trỏ khi gõ ô trả lời, không ấn được nút thích, hoặc nút xóa bình luận bị vô hiệu hóa dù bạn là Author.</span>
              </li>
              <li style={styles.featureItem}>
                <span style={styles.bullet}>•</span>
                <span><strong>Lỗi hiển thị (UI/UX Bugs):</strong> Chữ bị đè lên nhau, vỡ khung nội dung khi xem bằng điện thoại, giao diện Dark Mode hiển thị sai màu nền khiến chữ bị mờ, khó đọc.</span>
              </li>
              <li style={styles.featureItem}>
                <span style={styles.bullet}>•</span>
                <span><strong>Lỗi Dữ liệu & Truy cập:</strong> Truyện hiển thị lỗi 404, không tải được danh sách chương, hình ảnh minh họa (Illustrations) bị lỗi tải hoặc hiển thị chậm.</span>
              </li>
            </ul>

            <h3 style={styles.subTitle}>📝 Mẫu Gửi Báo Lỗi Chuẩn</h3>
            <p style={styles.paragraph}>
              Để giúp đội ngũ kỹ thuật dễ dàng khoanh vùng và xử lý lỗi nhanh nhất, khi bình luận báo lỗi ở phía dưới, các bạn vui lòng cung cấp thông tin theo mẫu sau:
            </p>
            <div style={styles.templateBox}>
              1. <strong>Thiết bị sử dụng:</strong> (Ví dụ: PC Windows - Trình duyệt Chrome / iPhone 13 - Trình duyệt Safari)<br />
              2. <strong>Hành động dẫn đến lỗi:</strong> (Ví dụ: Vào bộ truyện X, bấm vào nút 'Trả lời' của bình luận gốc)<br />
              3. <strong>Ảnh chụp màn hình lỗi:</strong> (Vui lòng đính kèm ảnh chụp popup hoặc mã lỗi console nếu có)
            </div>

            <p style={styles.paragraph}>
              Mọi ý kiến đóng góp mang tính xây dựng của các bạn luôn là đóng góp cực kỳ quý giá giúp hệ thống ngày một hoàn thiện và mang lại không gian tốt nhất cho cộng đồng Light Novel.
            </p>

            {/* Khối kênh liên hệ sơ phòng */}
            <div style={styles.contactBox}>
              <strong style={{ color: "#60a5fa", display: "block", marginBottom: "0.4rem" }}>
                🌐 Kênh liên lạc dự phòng:
              </strong>
              <div style={{ fontSize: "0.925rem" }}>
                Nếu gặp lỗi trắng màn hình hoàn toàn và không thể bình luận tại đây, hãy liên hệ trực tiếp qua: <br />
                📧 Email: <a href="mailto:tghuy.k24tt@kontum.udn.vn" style={styles.contactLink}>tghuy.k24tt@kontum.udn.vn</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "1200px",
    margin: "2rem auto",
    padding: "0 1rem",
    fontFamily: "system-ui, -apple-system, sans-serif",
    color: "#cbd5e1",
  },
  breadcrumb: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    marginBottom: "1rem",
    fontSize: "0.9rem",
  },
  breadcrumbBtn: {
    background: "#22252a",
    color: "#f1f5f9",
    border: "1px solid #31363f",
    padding: "0.4rem 0.8rem",
    borderRadius: "0.375rem",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
  },
  mainBox: {
    background: "#1f222a",
    border: "1px solid #2e3340",
    borderRadius: "0.5rem",
    overflow: "hidden",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)",
  },
  header: {
    background: "#181a20",
    padding: "1rem 1.25rem",
    borderBottom: "1px solid #2e3340",
    display: "flex",
    alignItems: "center",
  },
  headerTitle: {
    margin: 0,
    fontSize: "1.15rem",
    fontWeight: "700",
    color: "#f8fafc",
  },
  contentArea: {
    padding: "1.5rem",
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    marginBottom: "1.5rem",
    borderBottom: "1px dashed #2e3340",
    paddingBottom: "1rem",
  },
  avatar: {
    width: "45px",
    height: "45px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid #3b82f6",
  },
  userMeta: {
    display: "flex",
    flexDirection: "column",
    gap: "0.15rem",
  },
  username: {
    fontWeight: "700",
    color: "#60a5fa",
    fontSize: "0.95rem",
  },
  roleBadge: {
    fontSize: "0.75rem",
    color: "#94a3b8",
  },
  timeText: {
    marginLeft: "auto",
    fontSize: "0.85rem",
    color: "#64748b",
  },
  textContent: {
    display: "flex",
    flexDirection: "column",
    gap: "1.25rem",
  },
  paragraph: {
    fontSize: "0.975rem",
    lineHeight: "1.75",
    color: "#cbd5e1",
    margin: 0,
    textAlign: "justify",
  },
  alertBox: {
    padding: "1rem",
    background: "rgba(239, 68, 68, 0.1)",
    border: "1px solid rgba(239, 68, 68, 0.3)",
    borderRadius: "0.375rem",
    color: "#fca5a5",
  },
  codeText: {
    background: "#181a20",
    padding: "0.15rem 0.4rem",
    borderRadius: "0.25rem",
    fontFamily: "monospace",
    color: "#f43f5e",
    fontSize: "0.9rem",
  },
  kbdText: {
    background: "#31363f",
    padding: "0.1rem 0.3rem",
    borderRadius: "0.25rem",
    boxShadow: "0 1px 0 rgba(255,255,255,0.2)",
    fontSize: "0.85rem",
  },
  subTitle: {
    fontSize: "1.1rem",
    color: "#f8fafc",
    margin: "1.25rem 0 0.25rem 0",
    borderLeft: "4px solid #ef4444",
    paddingLeft: "0.5rem",
    fontWeight: "700",
  },
  featureList: {
    listStyleType: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: "0.85rem",
  },
  featureItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: "0.5rem",
    fontSize: "0.95rem",
    lineHeight: "1.6",
  },
  bullet: {
    color: "#ef4444",
    flexShrink: 0,
    fontWeight: "bold",
  },
  templateBox: {
    padding: "1rem",
    background: "#181a20",
    borderLeft: "4px solid #64748b",
    borderRadius: "0 0.375rem 0.375rem 0",
    fontSize: "0.95rem",
    lineHeight: "1.8",
    color: "#94a3b8",
  },
  contactBox: {
    marginTop: "1rem",
    padding: "1rem",
    background: "#181a20",
    border: "1px solid #2e3340",
    borderRadius: "0.375rem",
  },
  contactLink: {
    color: "#60a5fa",
    textDecoration: "none",
    fontWeight: "600",
  },
};