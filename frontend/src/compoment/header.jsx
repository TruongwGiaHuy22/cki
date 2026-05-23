import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Header() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("thongtin");
  const [isHidden, setIsHidden] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);

  const tabs = [
    { id: "sangtac", label: "Sáng tác", path: "/sangtac" },
    { id: "aidich", label: "AI dịch", path: "/ai" }, 
    { id: "xuatban", label: "Xuất bản", path: "/xuatban"},
    { id: "thaouan", label: "Thảo luận" },
    { id: "danhsach", label: "Danh sách", path: "/danhsach" }, 
    { id: "thongtin", label: "Thông tin" }
  ];

  // ✅ Active theo URL
  useEffect(() => {
    if (location.pathname.startsWith("/dang-truyen")) {
      setActiveTab("thongtin");
      return;
    }

    if (location.pathname === "/danhsach") {
      setActiveTab("danhsach");
      return;
    }

    if (location.pathname === "/ai") {
      setActiveTab("aidich");
      return;
    }

    if (location.pathname === "/sangtac") {
      setActiveTab("sangtac");
    }
    if (location.pathname === "/xuatban"){
      setActiveTab("xuatban");
    }
  }, [location.pathname]);

  // Ẩn header khi scroll xuống
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollingDown = currentScrollY > lastScrollY;
      const hasPassedThreshold = currentScrollY > 120;

      setIsHidden(scrollingDown && hasPassedThreshold);
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`header-main ${isHidden ? "header-hidden" : ""}`}>
      {/* TOP */}
      <div className="header-top">
        <Link to="/" className="logo">LightNovelVN</Link>

        <nav className="nav-main">
          <Link to="/">Trang chủ</Link>
        </nav>

        <div className="header-right">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="search-box"
          />
          <Link to="/login" className="btn-login">Đăng nhập</Link>
        </div>
      </div>

      {/* TABS */}
      <div className="header-tabs">
        {tabs.map(tab => {
          if (tab.id === "thongtin") {
            return (
              <div key={tab.id} className="header-info-dropdown">
                <button
                  onClick={() => setInfoOpen((v) => !v)}
                  className={`tab-btn-small ${activeTab === tab.id ? "active" : ""}`}
                >
                  Thông tin {infoOpen ? "▴" : "▾"}
                </button>
                {infoOpen ? (
                  <div className="header-info-menu">
                    <Link to="/dang-truyen" className="header-info-item" onClick={() => { setActiveTab("thongtin"); setInfoOpen(false); }}>Đăng truyện</Link>
                    <button className="header-info-item" onClick={() => setInfoOpen(false)}>Giới thiệu</button>
                    <button className="header-info-item" onClick={() => setInfoOpen(false)}>Góp ý - Báo lỗi</button>
                    <button className="header-info-item" onClick={() => setInfoOpen(false)}>Chính sách bảo mật</button>
                    <button className="header-info-item" onClick={() => setInfoOpen(false)}>Điều khoản sử dụng</button>
                  </div>
                ) : null}
              </div>
            );
          }
          // 👉 nếu có path → dùng Link
          if (tab.path) {
            return (
              <Link
                key={tab.id}
                to={tab.path}
                onClick={() => setActiveTab(tab.id)}
                className={`tab-btn-small ${activeTab === tab.id ? "active" : ""}`}
              >
                {tab.label}
              </Link>
            );
          }

          // 👉 không có path → button
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`tab-btn-small ${activeTab === tab.id ? "active" : ""}`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </header>
  );
}
