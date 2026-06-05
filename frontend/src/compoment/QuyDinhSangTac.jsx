import React from "react";
import { useNavigate } from "react-router-dom";

const QuyDinhSangTac = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.breadcrumb}>
        <button style={styles.breadcrumbBtn} onClick={() => navigate('/forum/create')}>
          🏠 Thảo luận
        </button>
      </div>

      <div style={styles.mainBox}>
        <div style={styles.header}>
          <h2 style={styles.headerTitle}>✍️ Quy Định, Hướng Dẫn & Chính Sách Sáng Tác Toàn Diện</h2>
        </div>
        
        <div style={styles.contentArea}>
          
          <section style={styles.section}>
            <h3 style={styles.subTitle}>I. Tiêu Chuẩn Nội Dung & Đạo Đức Sáng Tác</h3>
            <p style={styles.paragraph}>
              Tại Cổng Light Novel, chúng tôi coi trọng sự sáng tạo nguyên bản. Mọi tác giả cần cam kết tuân thủ các chuẩn mực sau:
            </p>
            <ul style={styles.list}>
              <li style={styles.item}>• <strong>Tính nguyên bản:</strong> Tác phẩm phải là sản phẩm trí tuệ của chính bạn. Nghiêm cấm mọi hình thức đạo văn, copy-paste hoặc chỉnh sửa văn bản của tác giả khác dưới tên mình.</li>
              <li style={styles.item}>• <strong>Kiểm duyệt nghiêm ngặt:</strong> Nội dung không được chứa các tình tiết vi phạm thuần phong mỹ tục, bạo lực máu me phản cảm hoặc các nội dung gây tranh cãi về chính trị, tôn giáo.</li>
              <li style={styles.item}>• <strong>Định dạng chuẩn mực:</strong> Hệ thống khuyến khích sử dụng các công cụ căn chỉnh để văn bản dễ đọc. Các chương truyện quá ngắn (dưới 1.000 chữ) hoặc quá dài (trên 10.000 chữ) nên được chia nhỏ để tối ưu trải nghiệm.</li>
              <li style={styles.item}>• <strong>Xử lý sai phạm:</strong> Nếu bị phát hiện đạo văn hoặc vi phạm tiêu chuẩn cộng đồng, tác phẩm sẽ bị gỡ bỏ ngay lập tức và tài khoản sẽ nhận cảnh cáo hoặc khóa vĩnh viễn tùy mức độ.</li>
            </ul>
          </section>

          <section style={styles.section}>
            <h3 style={styles.subTitle}>II. Hệ Thống Quản Trị & Công Cụ Hỗ Trợ (Studio Area)</h3>
            <p style={styles.paragraph}>
              Chúng tôi cung cấp "Studio Area" – bộ công cụ dành riêng cho tác giả để phát triển sự nghiệp viết lách chuyên nghiệp:
            </p>
            <ul style={styles.list}>
              <li style={styles.item}>• <strong>Quản lý chương mục:</strong> Hệ thống cho phép sắp xếp chương theo Volume, chỉnh sửa nội dung cũ, và hẹn giờ đăng bài (Scheduled Publishing) tự động.</li>
              <li style={styles.item}>• <strong>Analytics chi tiết:</strong> Tác giả có quyền truy cập vào biểu đồ dữ liệu: lượt xem theo ngày, tỷ lệ giữ chân độc giả (retention rate), và các chương được đọc nhiều nhất.</li>
              <li style={styles.item}>• <strong>Tương tác hai chiều:</strong> Tính năng "Ghim bình luận" và "Trả lời chuyên biệt" giúp tác giả tạo mối liên kết chặt chẽ với những độc giả trung thành nhất.</li>
            </ul>
          </section>

          <section style={styles.section}>
            <h3 style={styles.subTitle}>III. Chiến Lược Xây Dựng Thương Hiệu Tác Giả</h3>
            <p style={styles.paragraph}>
              Để bộ truyện của bạn trở thành "siêu phẩm" trên hệ thống, chúng tôi khuyến khích:
            </p>
            <ul style={styles.list}>
              <li style={styles.item}>• <strong>Đầu tư hình ảnh:</strong> Một bộ ảnh bìa ấn tượng là chìa khóa thu hút độc giả. Bạn có thể sử dụng các gói thiết kế chuyên nghiệp hoặc hợp tác với các họa sĩ trong cộng đồng.</li>
              <li style={styles.item}>• <strong>Nhật ký tác giả:</strong> Sử dụng mục "Thông báo tác giả" để chia sẻ cảm xúc, giải đáp thắc mắc hoặc thông báo tiến độ làm việc, điều này giúp tăng sự kết nối với cộng đồng.</li>
              <li style={styles.item}>• <strong>Tối ưu hóa SEO:</strong> Đặt tiêu đề thu hút, viết tóm tắt (Synopsis) súc tích và sử dụng các tag thể loại (Tags) chính xác để thuật toán hiển thị bộ truyện đến đúng độc giả mục tiêu.</li>
            </ul>
          </section>

          <section style={styles.section}>
            <h3 style={styles.subTitle}>IV. Chính Sách Hợp Tác & Quyền Lợi Đặc Quyền</h3>
            <ul style={styles.list}>
              <li style={styles.item}>• <strong>Chương trình đề cử:</strong> Những tác phẩm có tốc độ tăng trưởng tốt và nhận được phản hồi tích cực sẽ được BQT xem xét đưa vào "Box truyện nổi bật" ngay trên trang chủ.</li>
              <li style={styles.item}>• <strong>Cơ hội xuất bản:</strong> Trong tương lai, chúng tôi sẽ kết nối các tác phẩm có tiềm năng lớn với các đơn vị xuất bản uy tín để chuyển thể thành sách in hoặc webtoon.</li>
              <li style={styles.item}>• <strong>Hỗ trợ kỹ thuật 24/7:</strong> Đội ngũ Admin luôn sẵn sàng hỗ trợ bạn xử lý lỗi hiển thị, chỉnh sửa định dạng hoặc giải quyết tranh chấp bản quyền tác phẩm.</li>
            </ul>
          </section>

          <section style={styles.section}>
            <h3 style={styles.subTitle}>V. Trách Nhiệm Với Độc Giả</h3>
            <p style={styles.paragraph}>
              Việc bỏ dở tác phẩm (drop) gây ảnh hưởng xấu đến trải nghiệm người dùng. Nếu bạn gặp khó khăn về thời gian, hãy thông báo rõ ràng cho độc giả thông qua "Thông báo tạm ngưng" hoặc "Lịch trình mới". Sự minh bạch và chuyên nghiệp là yếu tố then chốt để xây dựng uy tín cá nhân của một tác giả Light Novel chuyên nghiệp trên hệ thống.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageWrapper: {
    width: "100%",
    minHeight: "100vh",
    padding: "30px",
    background: "#0f172a",
    boxSizing: "border-box",
    color: "#e2e8f0",
  },
  breadcrumb: { marginBottom: "20px" },
  breadcrumbBtn: {
    background: "#1e293b",
    color: "#f8fafc",
    border: "1px solid #334155",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
  },
  mainBox: {
    width: "100%",
    background: "#1e293b",
    borderRadius: "12px",
    border: "1px solid #334155",
  },
  header: {
    padding: "30px",
    borderBottom: "1px solid #334155",
    background: "#0f172a",
    borderRadius: "12px 12px 0 0",
  },
  headerTitle: { margin: 0, fontSize: "1.8rem", color: "#fbbf24" },
  contentArea: { padding: "40px", lineHeight: "1.8" },
  section: { marginBottom: "40px" },
  subTitle: {
    fontSize: "1.4rem",
    color: "#f8fafc",
    marginBottom: "15px",
    borderLeft: "5px solid #fbbf24",
    paddingLeft: "15px",
  },
  paragraph: { fontSize: "1.1rem", marginBottom: "15px" },
  list: { listStyle: "none", padding: 0 },
  item: { marginBottom: "12px", fontSize: "1rem" }
};
export default QuyDinhSangTac;