import React from "react";
import { useNavigate } from "react-router-dom";

export default function QuyDinhChung() {
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
          <h2 style={styles.headerTitle}>📜 Điều Khoản Dịch Vụ & Quy Định Cộng Đồng Chi Tiết</h2>
        </div>
        
        <div style={styles.contentArea}>
          {/* I. Nguyên tắc ứng xử */}
          <section style={styles.section}>
            <h3 style={styles.subTitle}>I. Nguyên Tắc Ứng Xử & Văn Hóa Cộng Đồng</h3>
            <p style={styles.paragraph}>
              Cổng Light Novel vận hành dựa trên tinh thần tôn trọng lẫn nhau. Để duy trì một môi trường văn minh, thành viên cần tuân thủ:
            </p>
            <ul style={styles.list}>
              <li style={styles.item}>• **Ngôn từ:** Không sử dụng từ ngữ thô tục, công kích cá nhân, miệt thị vùng miền hoặc phân biệt chủng tộc/giới tính.</li>
              <li style={styles.item}>• **Hành vi gây hấn:** Nghiêm cấm mọi hành vi kích động chiến tranh (war), kéo bè phái tấn công cá nhân hoặc tổ chức khác.</li>
              <li style={styles.item}>• **Nội dung nhạy cảm:** Tuyệt đối không đăng tải các liên kết, hình ảnh hoặc văn bản đồi trụy, bạo lực cực đoan hoặc các nội dung vi phạm pháp luật hiện hành tại Việt Nam.</li>
              <li style={styles.item}>• **Tôn trọng tranh luận:** Khuyến khích phản biện dựa trên kiến thức và logic, tuyệt đối không lăng mạ người có ý kiến trái chiều.</li>
            </ul>
          </section>

          {/* II. Bản quyền */}
          <section style={styles.section}>
            <h3 style={styles.subTitle}>II. Chính Sách Bản Quyền & Tài Sản Trí Tuệ</h3>
            <p style={styles.paragraph}>
              Chúng tôi bảo vệ tối đa quyền lợi của những người sáng tạo và dịch thuật:
            </p>
            <ul style={styles.list}>
              <li style={styles.item}>• **Bản quyền gốc:** Khuyến khích người đọc ủng hộ các tác phẩm chính chủ thông qua việc mua bản quyền giấy hoặc e-book khi có thể.</li>
              <li style={styles.item}>• **Sở hữu trí tuệ dịch thuật:** Nội dung dịch là thành quả lao động của các nhóm dịch. Việc copy, re-up sang nền tảng khác khi chưa có sự đồng ý của "Chủ thớt" là vi phạm nghiêm trọng.</li>
              <li style={styles.item}>• **Xử lý vi phạm:** Hệ thống có cơ chế report thông minh. BQT sẽ tiến hành xóa nội dung vi phạm và áp dụng hình thức khóa tài khoản vĩnh viễn đối với các hành vi re-up tái phạm nhiều lần.</li>
            </ul>
          </section>

          {/* III. Tài khoản và Bảo mật */}
          <section style={styles.section}>
            <h3 style={styles.subTitle}>III. Bảo Mật Tài Khoản & Trách Nhiệm Thành Viên</h3>
            <p style={styles.paragraph}>
              Mỗi thành viên chịu hoàn toàn trách nhiệm về tài khoản của mình:
            </p>
            <ul style={styles.list}>
              <li style={styles.item}>• **Thông tin tài khoản:** Người dùng có trách nhiệm giữ bí mật mật khẩu. Mọi hoạt động phát sinh từ tài khoản của bạn đều được coi là của chính bạn.</li>
              <li style={styles.item}>• **Chống gian lận:** Nghiêm cấm sử dụng các công cụ tự động (bot, script) để cày view, tăng like hoặc thao túng bảng xếp hạng.</li>
              <li style={styles.item}>• **Định danh:** Không được mạo danh Admin, Mod hoặc các thành viên uy tín khác để trục lợi hoặc lừa đảo.</li>
            </ul>
          </section>

          {/* IV. Miễn trừ trách nhiệm */}
          <section style={styles.section}>
            <h3 style={styles.subTitle}>IV. Miễn Trừ Trách Nhiệm</h3>
            <p style={styles.paragraph}>
              Để đảm bảo vận hành ổn định, Ban Quản Trị tuyên bố:
            </p>
            <ul style={styles.list}>
              <li style={styles.item}>• **Nội dung do người dùng đăng tải:** Chúng tôi không chịu trách nhiệm về tính chính xác của nội dung do người dùng tự đăng. Mọi tranh chấp về bản quyền giữa các nhóm dịch là vấn đề nội bộ.</li>
              <li style={styles.item}>• **Gián đoạn dịch vụ:** BQT không chịu trách nhiệm cho các tổn thất dữ liệu hoặc thời gian gián đoạn hệ thống do bảo trì, tấn công mạng hoặc lỗi máy chủ ngoài ý muốn.</li>
            </ul>
          </section>

          {/* V. Quy định bình luận */}
          <section style={styles.section}>
            <h3 style={styles.subTitle}>V. Quy Định Bình Luận & Thảo Luận</h3>
            <ul style={styles.list}>
              <li style={styles.item}>• **Spoiler:** Bắt buộc sử dụng công cụ ẩn Spoiler đối với các tình tiết quan trọng chưa xuất hiện trong chương truyện hiện tại của bản dịch.</li>
              <li style={styles.item}>• **Spam:** Nghiêm cấm spam nội dung, quảng cáo link rác, link dẫn đến các trang web lừa đảo hoặc trang web chứa mã độc.</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
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
  headerTitle: { margin: 0, fontSize: "1.8rem", color: "#60a5fa" },
  contentArea: { padding: "40px", lineHeight: "1.8" },
  section: { marginBottom: "40px" },
  subTitle: {
    fontSize: "1.4rem",
    color: "#f8fafc",
    marginBottom: "15px",
    borderLeft: "5px solid #3b82f6",
    paddingLeft: "15px",
  },
  paragraph: { fontSize: "1.1rem", marginBottom: "15px" },
  list: { listStyle: "none", padding: 0 },
  item: { marginBottom: "12px", fontSize: "1rem" }
};