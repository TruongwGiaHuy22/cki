import React from "react";
import { useNavigate } from "react-router-dom";

export default function Introduction() {
  const navigate = useNavigate();

  return (
    <div style={styles.introContainer}>
      {/* Breadcrumb điều hướng */}
      <div style={styles.breadcrumb}>
        <button 
          style={styles.breadcrumbBtn}
          onClick={() => navigate('/forum/create')}
        >
          🏠 Thảo luận
        </button>
      </div>

      {/* Khối nội dung giới thiệu chính */}
      <div style={styles.mainBox}>
        {/* Header của Khối */}
        <div style={styles.header}>
          <span style={{ marginRight: "0.5rem" }}>🔒</span>
          <h2 style={styles.headerTitle}>Giới thiệu Cổng Light Novel</h2>
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

          {/* Nội dung giới thiệu chi tiết siêu dài */}
          <div style={styles.textContent}>
            <p style={styles.paragraph}>
              Chào mừng toàn thể các cư dân của thế giới 2D, các dịch giả kỳ cựu đầy tâm huyết, các tác giả ẩn danh đang ấp ủ những siêu phẩm dị giới, và đặc biệt là hàng vạn độc giả trung thành đã đặt chân đến với <strong>Cổng Light Novel</strong>. 
              Nền tảng này được xây dựng và nuôi dưỡng từ ngọn lửa đam mê bất tận đối với những trang sách, những minh họa tuyệt mỹ và những chuyến phiêu lưu kỳ thú xuyên qua muôn vàn thế giới giả tưởng. Chúng tôi ra đời với một sứ mệnh duy nhất: Trở thành thánh địa trực tuyến chuyên nghiệp, toàn diện và phát triển mạnh mẽ nhất dành riêng cho cộng đồng Light Novel tại Việt Nam.
            </p>

            <p style={styles.paragraph}>
              Trong bối cảnh nền văn hóa Light Novel/Web Novel đang ngày càng phát triển rực rỡ, việc tìm kiếm một không gian đọc truyện chuẩn mực, mượt mà và không bị quấy nhiễu bởi quảng cáo rác trở thành nhu cầu thiết yếu. 
              Hiểu được điều đó, hệ thống của chúng tôi không chỉ đơn thuần là một website đọc truyện thông thường, mà là một <em>Hệ sinh thái tương tác đa chiều</em>. Đây là nơi các nhóm dịch độc lập tìm thấy vùng đất hứa để khẳng định thương hiệu; nơi các ngòi bút tự sáng tác (Original Light Novel) đưa đứa con tinh thần của mình tiếp cận gần hơn với công chúng; và là nơi những tâm hồn đồng điệu cùng nhau thức thâu đêm để theo dõi từng chương truyện mới nhất.
            </p>

            <h3 style={styles.subTitle}>🎯 Định Hướng Bản Sắc Và Giá Trị Cốt Lõi</h3>
            <ul style={styles.featureList}>
              <li style={styles.featureItem}>
                <span style={styles.bullet}>•</span>
                <span><strong>Thư viện tích trữ tối thượng:</strong> Chúng tôi liên tục cập nhật, phân loại và lưu trữ từ các bộ Light Novel kinh điển đã đặt nền móng cho ngành công nghiệp, cho đến những làn sóng Web Novel, Isekai, Rom-com, Fantasy mới nhất vừa ra mắt tại Nhật Bản, Trung Quốc và Hàn Quốc.</span>
              </li>
              <li style={styles.featureItem}>
                <span style={styles.bullet}>•</span>
                <span><strong>Đại lộ vinh danh Dịch giả & Tác giả:</strong> Cung cấp một hệ thống quản trị (Studio Area) tối tân dành riêng cho các chủ thớt. Bạn có thể tự do lên lịch đăng chương tự động, quản lý nhân sự nhóm dịch, thống kê chi tiết số lượt đọc theo thời gian thực và nhận phản hồi trực tiếp từ người hâm mộ thông qua hệ thống bình luận đa tầng mượt mà.</span>
              </li>
              <li style={styles.featureItem}>
                <span style={styles.bullet}>•</span>
                <span><strong>Đại tiệc thị giác (Illustrations):</strong> Toàn bộ tranh minh họa đen trắng và các trang màu mở đầu (Color Spreads) đều được lưu trữ với độ phân giải cao nhất trên cụm máy chủ CDN phân tán tốc độ cao. Cam kết hình ảnh sắc nét đến từng chi tiết, không bị nén vỡ hình, mang lại trải nghiệm lật trang mãn nhãn như đang cầm trên tay cuốn sách giấy.</span>
              </li>
              <li style={styles.featureItem}>
                <span style={styles.bullet}>•</span>
                <span><strong>Cá nhân hóa trải nghiệm đọc tuyệt đối:</strong> Loại bỏ hoàn toàn sự gò bó của giao diện mặc định. Người đọc có thể dễ dàng tinh chỉnh cấu hình phông chữ (serif/sans-serif), tăng giảm kích thước chữ, thay đổi khoảng cách dòng linh hoạt, và đặc biệt là hệ thống bảng màu nền bảo vệ mắt chuyên sâu chống mỏi điều tiết khi cày truyện xuyên màn đêm.</span>
              </li>
              <li style={styles.featureItem}>
                <span style={styles.bullet}>•</span>
                <span><strong>Cộng đồng thảo luận học thuật & Văn minh:</strong> Khuyến khích các bài viết đánh giá (Review) chuyên sâu, các topic phân tích giả thuyết cốt truyện, dự đoán tình tiết chương sau. Hệ thống phân tầng phản hồi thông minh giúp các cuộc tranh luận diễn ra mạch lạc, rõ ràng và tràn đầy tinh thần tôn trọng chất xám.</span>
              </li>
            </ul>

            <h3 style={styles.subTitle}>⚔️ Hệ Thống Phân Cấp & Danh Hiệu Thành Viên</h3>
            <p style={styles.paragraph}>
              Để tăng phần thú vị và ghi nhận những đóng góp của mọi người cho sự phát triển của Cổng Light Novel, hệ thống tích hợp cơ chế danh hiệu tự động dựa trên mức độ hoạt động:
            </p>
            <ul style={styles.featureList}>
              <li style={styles.featureItem}>
                <span style={styles.bullet}>❖</span>
                <span><strong>Tân Thủ / Thường Dân:</strong> Những thành viên mới gia nhập, đang trên con đường khám phá kho tàng truyện của hệ thống.</span>
              </li>
              <li style={styles.featureItem}>
                <span style={styles.bullet}>❖</span>
                <span><strong>Mộc Sách / Học Giả:</strong> Dành cho những "mọt truyện" chân chính với số lượng chương truyện đã đọc đạt mốc cực khủng và thường xuyên để lại những bình luận chất lượng.</span>
              </li>
              <li style={styles.featureItem}>
                <span style={styles.bullet}>❖</span>
                <span><strong>Huyền Thoại Dịch Giả / Đại Hiền Triết:</strong> Huy hiệu độc quyền lấp lánh dành cho các dịch giả/nhóm dịch sở hữu những bộ truyện có lượt theo dõi và tương tác đứng đầu bảng xếp hạng.</span>
              </li>
            </ul>

            <h3 style={styles.subTitle}>📜 Quy Tắc Ứng Xử Trên Thánh Địa</h3>
            <p style={styles.paragraph}>
              Để giữ vững một môi trường lành mạnh và văn minh, Ban Quản Trị (BQT) mong muốn toàn thể các cư dân tuân thủ nghiêm ngặt các điều khoản sau: Không Spoil/Tiết lộ trước tình tiết cốt truyện ở các khu vực không cho phép; Tuyệt đối không gây war, phân biệt vùng miền, xúc phạm cá nhân hay sử dụng ngôn từ thô tục; Tôn trọng công sức của các dịch giả bằng cách không re-up trái phép khi chưa được sự đồng ý của chủ thớt.
            </p>

            <p style={styles.paragraph}>
              Chúng tôi luôn luôn lắng nghe, ghi nhận và trân trọng mọi ý kiến đóng góp, phản hồi lỗi hệ thống hay các đề xuất hợp tác lâu dài từ phía các bạn. Sự đồng hành, ủng hộ và tin tưởng của các bạn chính là nguồn động lực to lớn nhất để chúng tôi không ngừng nâng cấp, hoàn thiện hệ thống ngày một vững mạnh hơn trong tương lai.
            </p>

            {/* Khối thông tin liên hệ */}
            <div style={styles.contactBox}>
              <strong style={{ color: "#60a5fa", display: "block", marginBottom: "0.5rem" }}>
                📬 Thông Tin Liên Hệ & Đóng Góp Ý Kiến:
              </strong>
              <div style={{ lineHeight: "1.6" }}>
                <div>Mọi thắc mắc về vấn đề tài khoản, bản quyền, báo lỗi hệ thống hoặc đăng ký gia nhập hàng ngũ nhân sự, vui lòng liên hệ trực tiếp với chúng tôi qua:</div>
                <div style={{ marginTop: "0.5rem", fontWeight: "600" }}>
                  <span>Liên hệ: </span>
                  <a href="mailto:tghuy.k24tt@kontum.udn.vn" style={styles.contactLink}>
                    tghuy.k24tt@kontum.udn.vn
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ========================================================
// 🎨 STYLES DOWN BELOW: Đẩy toàn bộ CSS xuống dưới cho dễ nhìn
// ========================================================
const styles = {
  introContainer: {
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
  subTitle: {
    fontSize: "1.1rem",
    color: "#f8fafc",
    margin: "1.5rem 0 0.25rem 0",
    borderLeft: "4px solid #3b82f6",
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
    color: "#3b82f6",
    flexShrink: 0,
    fontWeight: "bold",
  },
  contactBox: {
    marginTop: "1.5rem",
    padding: "1.25rem",
    background: "#181a20",
    border: "1px solid #2e3340",
    borderRadius: "0.375rem",
    fontSize: "0.95rem",
  },
  contactLink: {
    color: "#60a5fa",
    textDecoration: "none",
    fontWeight: "600",
    transition: "color 0.2s",
  },
};