import React from "react";
import { useNavigate } from "react-router-dom";

export default function TermsOfService() {
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

      {/* Khối nội dung Điều khoản sử dụng */}
      <div style={styles.mainBox}>
        {/* Header của Khối */}
        <div style={styles.header}>
          <span style={{ marginRight: "0.5rem" }}>📜</span>
          <h2 style={styles.headerTitle}>Điều khoản sử dụng hệ thống</h2>
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

          {/* Nội dung điều khoản chi tiết siêu dài */}
          <div style={styles.textContent}>
            <p style={styles.paragraph}>
              Chào mừng bạn đến với cộng đồng <strong>Cổng Light Novel</strong>. Đây là sân chơi trực tuyến công bằng, văn minh được xây dựng dành riêng cho những người có niềm đam mê bất tận với thể loại Light Novel, Web Novel và các tác phẩm sáng tác tự do. Hệ thống cung cấp không gian để thành viên có thể đọc truyện, thảo luận, đăng tải các bản dịch cá nhân hoặc chia sẻ những tác phẩm do chính mình sáng tác.
            </p>
            
            <p style={styles.paragraph}>
              Để duy trì một môi trường giao lưu lành mạnh, bảo vệ quyền lợi hợp pháp của cả người đọc lẫn đội ngũ sáng tạo nội dung, xin vui lòng đọc kỹ các quy định dưới đây. Việc bạn đăng ký tài khoản và tham gia hoạt động trên website đồng nghĩa với việc bạn tự nguyện cam kết tuân thủ tuyệt đối các điều khoản sử dụng này.
            </p>

            <h3 style={styles.subTitle}>1. Quyền Sở Hữu Nội Dung & Trách Nhiệm Dân Sự</h3>
            <ul style={styles.featureList}>
              <li style={styles.featureItem}>
                <span style={styles.bullet}>•</span>
                <span><strong>Cổng Light Novel không nắm giữ bản quyền:</strong> Trang web của chúng tôi vận hành theo mô hình nền tảng mở (Platform). BQT hoàn toàn không sở hữu bản quyền đối với bất kỳ nội dung nào do người dùng độc lập tự ý đăng tải, bao gồm cả các bản dịch, hình ảnh minh họa đính kèm hoặc các tác phẩm sáng tác gốc.</span>
              </li>
              <li style={styles.featureItem}>
                <span style={styles.bullet}>•</span>
                <span><strong>Trách nhiệm pháp lý của người đăng:</strong> Bạn phải tự chịu trách nhiệm hoàn toàn trước pháp luật và cộng đồng về bản quyền, tính chính xác và nội dung của mọi thông tin, tệp tin, hình ảnh hoặc văn bản mà bạn tải lên hệ thống. BQT sẽ không chịu trách nhiệm cho bất kỳ tổn thất hoặc tranh chấp phát sinh nào giữa các bên liên quan.</span>
              </li>
            </ul>

            <h3 style={styles.subTitle}>2. Quy Định Khắt Khe Về Nội Dung Đăng Tải</h3>
            <p style={styles.paragraph}>
              Mọi nội dung xuất hiện trên hệ thống bao gồm: Truyện dịch, truyện sáng tác, bài viết thảo luận, đánh giá (Review) và bình luận ở các chương phải đáp ứng đầy đủ các tiêu chí nghiêm ngặt sau:
            </p>
            <ul style={styles.featureList}>
              <li style={styles.featureItem}>
                <span style={styles.bullet}>•</span>
                <span><strong>Tuân thủ pháp luật hiện hành:</strong> Tuyệt đối không đăng tải, chia sẻ các nội dung vi phạm pháp luật nước Cộng hòa Xã hội Chủ nghĩa Việt Nam. Nghiêm cấm các bài viết có xu hướng chính trị, chống phá nhà nước, phá hoại khối đại đoàn kết dân tộc hoặc kích động bạo lực.</span>
              </li>
              <li style={styles.featureItem}>
                <span style={styles.bullet}>•</span>
                <span><strong>Tuân thủ nội quy trang web:</strong> Các nội dung chứa yếu tố bạo lực cực đoan, phân biệt chủng tộc, đồi trụy, thuần phong mỹ tục hoặc xúc phạm, lăng mạ các cá nhân/tổ chức khác sẽ bị gỡ bỏ ngay lập tức mà không cần báo trước.</span>
              </li>
              <li style={styles.featureItem}>
                <span style={styles.bullet}>•</span>
                <span><strong>Giữ gìn không gian thảo luận:</strong> Nghiêm cấm các hành vi spam link quảng cáo, cá độ, sử dụng công cụ tạo bình luận hàng loạt (Spam bot) làm ảnh hưởng đến trải nghiệm đọc truyện chung của hệ thống.</span>
              </li>
            </ul>

            <h3 style={styles.subTitle}>3. Cơ Chế Xử Lý Khiếu Nại & Bản Quyền Tác Giả</h3>
            <p style={styles.paragraph}>
              Chúng tôi luôn tôn trọng quyền sở hữu trí tuệ và chất xám của tất cả các tác giả, họa sĩ và nhà xuất bản trên toàn thế giới. Mặc dù hệ thống không trực tiếp kiểm duyệt trước mọi nội dung do người dùng tải lên, chúng tôi cam kết sẽ phối hợp xử lý nhanh chóng nhất:
            </p>
            <div style={styles.templateBox}>
              📌 Nếu phát hiện bất kỳ nội dung nào vi phạm bản quyền tác phẩm đã được bảo hộ hợp pháp tại Việt Nam, chủ sở hữu bản quyền hoặc đại diện hợp pháp vui lòng gửi yêu cầu gỡ bỏ trực tiếp cho BQT. <br />
              📌 Chúng tôi sẽ tiến hành xác minh thông tin nhanh chóng, tiến hành ẩn hoặc xóa vĩnh viễn các nội dung vi phạm để bảo đảm quyền lợi hợp pháp cho các bên.
            </div>

            <h3 style={styles.subTitle}>4. Biện Pháp Xử Lý Vi Phạm Điều Khoản</h3>
            <p style={styles.paragraph}>
              BQT có toàn quyền áp dụng các hình thức xử lý kỷ luật từ nhẹ đến nặng đối với các tài khoản cố tình vi phạm điều khoản sử dụng tùy theo mức độ nghiêm trọng: Cảnh cáo hệ thống, khóa quyền bình luận có thời hạn, ẩn vĩnh viễn truyện đăng tải trái phép, và tối cao là khóa tài khoản vĩnh viễn (Ban nick) kết hợp chặn địa chỉ IP truy cập đối với các thành viên cố tình phá hoại.
            </p>

            {/* Khối thông tin liên hệ cập nhật theo hệ thống của bạn */}
            <div style={styles.contactBox}>
              <strong style={{ color: "#3b82f6", display: "block", marginBottom: "0.5rem" }}>
                📬 Thông Tin Liên Hệ Ban Quản Trị:
              </strong>
              <div style={{ lineHeight: "1.7" }}>
                Mọi thắc mắc, khiếu nại bản quyền hoặc báo cáo hành vi vi phạm nội quy, vui lòng gửi về cho ban quản trị thông qua địa chỉ email chính thức sau:
                <div style={{ marginTop: "0.5rem", fontWeight: "600" }}>
                  <span>Email: </span>
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
  templateBox: {
    padding: "1rem 1.25rem",
    background: "#181a20",
    borderLeft: "4px solid #eab308",
    borderRadius: "0 0.375rem 0.375rem 0",
    fontSize: "0.95rem",
    lineHeight: "1.8",
    color: "#cbd5e1",
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
  },
};