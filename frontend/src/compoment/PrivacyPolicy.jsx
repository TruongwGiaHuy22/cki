import React from "react";
import { useNavigate } from "react-router-dom";

export default function PrivacyPolicy() {
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

      {/* Khối nội dung Chính sách bảo mật */}
      <div style={styles.mainBox}>
        {/* Header của Khối */}
        <div style={styles.header}>
          <span style={{ marginRight: "0.5rem" }}>🛡️</span>
          <h2 style={styles.headerTitle}>Chính sách bảo mật dữ liệu</h2>
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

          {/* Nội dung chính sách chi tiết */}
          <div style={styles.textContent}>
            <p style={styles.paragraph}>
              Chào mừng bạn đến với <strong>Cổng Light Novel</strong>. Chúng tôi coi trọng quyền riêng tư của bạn và cam kết bảo vệ tuyệt đối các thông tin cá nhân mà bạn cung cấp trong quá trình tương tác, trải nghiệm và sử dụng các dịch vụ trên hệ thống website của chúng tôi. 
            </p>
            
            <p style={styles.paragraph}>
              Văn bản này làm rõ cách thức chúng tôi thu thập, xử lý, lưu trữ và bảo vệ dữ liệu cá nhân của thành viên. Khi bạn đăng ký tài khoản và tiếp tục sử dụng dịch vụ, điều đó đồng nghĩa với việc bạn hoàn toàn đồng ý với các điều khoản được quy định dưới đây.
            </p>

            <h3 style={styles.subTitle}>1. Thông Tin Chúng Tôi Thu Thập</h3>
            <p style={styles.paragraph}>
              Để đảm bảo cung cấp và duy trì các hoạt động cốt lõi, giảm thiểu tối đa các hành vi phá hoại tài nguyên, hệ thống sẽ tiến hành thu thập một số thông tin cơ bản sau:
            </p>
            <ul style={styles.featureList}>
              <li style={styles.featureItem}>
                <span style={styles.bullet}>•</span>
                <span><strong>Địa chỉ Email:</strong> Được thu thập khi bạn tiến hành đăng ký thành viên. Email là phương thức định danh duy nhất dùng để xác thực tài khoản, hỗ trợ khôi phục mật khẩu khi bị mất, nhận các thông báo quan trọng từ Ban Quản Trị (BQT) hoặc cập nhật trạng thái từ các chương truyện bạn đang theo dõi.</span>
              </li>
              <li style={styles.featureItem}>
                <span style={styles.bullet}>•</span>
                <span><strong>Địa chỉ IP & Dữ liệu log:</strong> Hệ thống tự động ghi nhận địa chỉ IP, loại trình duyệt, hệ điều hành và thời gian truy cập của người dùng khi bạn gửi bình luận hoặc đăng tải nội dung. Điều này giúp chúng tôi phân tích lưu lượng, kiểm soát tính ổn định và ngăn chặn kịp thời các đợt tấn công từ chối dịch vụ (DDoS) hoặc spam bot phá hoại diễn đàn.</span>
              </li>
              <li style={styles.featureItem}>
                <span style={styles.bullet}>•</span>
                <span><strong>Dữ liệu lưu trữ cục bộ (Local Storage/Session):</strong> Lưu trữ thông tin trạng thái đăng nhập và cấu hình giao diện đọc cá nhân (font chữ, size chữ, màu nền ban đêm) nhằm mang lại trải nghiệm tiện lợi, không phải thiết lập lại ở mỗi phiên truy cập.</span>
              </li>
            </ul>

            <h3 style={styles.subTitle}>2. Mục Đích Sử Dụng Thông Tin</h3>
            <p style={styles.paragraph}>
              Mọi dữ liệu thu thập được từ người dùng chỉ được sử dụng nghiêm ngặt cho các hoạt động vận hành nội bộ của Cổng Light Novel, bao gồm:
            </p>
            <div style={styles.templateBox}>
              🔹 Duy trì trạng thái hoạt động ổn định và tối ưu hiệu năng hiển thị của hệ thống.<br />
              🔹 Xác minh danh tính người dùng nhằm bảo vệ quyền lợi của các dịch giả/author khi đăng tải tác phẩm độc quyền.<br />
              🔹 Hỗ trợ và giải quyết nhanh chóng các yêu cầu khiếu nại, báo cáo vi phạm, hoặc khôi phục dữ liệu từ phía thành viên.<br />
              🔹 Phát hiện, ngăn chặn và xử lý nghiêm các tài khoản cố tình vi phạm quy tắc ứng xử, spam quảng cáo hoặc re-up truyện trái phép.
            </div>

            <h3 style={styles.subTitle}>3. Cam Kết Tuyệt Đối Không Mua Bán Dữ Liệu</h3>
            <p style={styles.paragraph}>
              Cổng Light Novel hoạt động trên tinh thần phi thương mại và vì lợi ích cộng đồng. Chúng tôi <strong>khẳng định không mua, bán, cho thuê, trao đổi hoặc chia sẻ</strong> bất kỳ thông tin cá nhân hay dữ liệu hành vi nào của người dùng cho bên thứ ba vì mục đích quảng cáo thương mại hoặc lợi ích tài chính cá nhân. Dữ liệu của bạn được mã hóa an toàn trên hệ thống database của localhost/server và chỉ được sử dụng trong phạm vi quy định tại chính sách này.
            </p>

            <h3 style={styles.subTitle}>4. Biện Pháp Bảo Mật Dữ Liệu</h3>
            <p style={styles.paragraph}>
              Chúng tôi áp dụng các chuẩn mực kỹ thuật cần thiết, bao gồm mã hóa một chiều mật khẩu người dùng (Hashing), sử dụng cơ chế Token (JWT) cho các phiên đăng nhập, và phân quyền quản trị cơ sở dữ liệu chặt chẽ để bảo vệ thông tin khỏi nguy cơ rò rỉ hoặc truy cập trái phép. Tuy nhiên, do đặc thù môi trường Internet không có bất kỳ hệ thống truyền tải nào an toàn tuyệt đối 100%, chúng tôi khuyến khích bạn tự bảo vệ mật khẩu cá nhân và không chia sẻ tài khoản cho người khác.
            </p>

            <h3 style={styles.subTitle}>5. Quyền Của Người Dùng Đối Với Dữ Liệu</h3>
            <p style={styles.paragraph}>
              Bạn hoàn toàn có quyền chủ động quản lý dữ liệu cá nhân của mình thông qua hệ thống: Thay đổi thông tin hiển thị và mật khẩu trong trang cá nhân; Yêu cầu xóa các bình luận, bài viết do chính bạn tạo ra; Gửi yêu cầu vô hiệu hóa hoặc xóa bỏ tài khoản hoàn toàn khỏi hệ thống dữ liệu nếu không còn nhu cầu sử dụng.
            </p>

            <h3 style={styles.subTitle}>6. Thay Đổi Nội Dung Chính Sách</h3>
            <p style={styles.paragraph}>
              Chính sách bảo mật này có thể được điều chỉnh, cập nhật định kỳ để phù hợp với các tính năng mới của website hoặc theo quy định pháp lý. Mọi thay đổi lớn sẽ được BQT thông báo công khai tại mục Thảo luận hệ thống để người dùng tiện theo dõi.
            </p>

            {/* Khối thông tin liên hệ chính thức */}
            <div style={styles.contactBox}>
              <strong style={{ color: "#3b82f6", display: "block", marginBottom: "0.5rem" }}>
                📬 Thông Tin Liên Hệ Ban Quản Trị:
              </strong>
              <div style={{ lineHeight: "1.7" }}>
                Nếu bạn có bất kỳ thắc mắc, đóng góp ý kiến hoặc yêu cầu kỹ thuật nào liên quan đến quyền bảo mật và dữ liệu cá nhân trên website, vui lòng liên hệ trực tiếp với chúng tôi qua địa chỉ:
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
    borderLeft: "4px solid #3b82f6",
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