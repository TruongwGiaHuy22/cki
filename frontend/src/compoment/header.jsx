import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import logoImg from "../assets/ln.png";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("thongtin");
  const [isHidden, setIsHidden] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [userDropdown, setUserDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Lấy user từ localStorage/sessionStorage
  useEffect(() => {
    let userStr = localStorage.getItem("user") || sessionStorage.getItem("user");
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch {}
    } else {
      setUser(null);
    }
  }, []);

  // Đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  // Tìm kiếm truyện
  const handleSearch = async (value) => {
    setSearchQuery(value);
    if (value.trim().length === 0) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }
    try {
      const res = await fetch(`http://localhost:4000/api/novels/search?q=${encodeURIComponent(value)}`);
      const json = await res.json();
      setSearchResults(json.data || []);
      setShowSearchResults(true);
    } catch (err) {
      console.error("Search error:", err);
      setSearchResults([]);
    }
  };

  const handleSelectResult = (novelId) => {
    setSearchQuery("");
    setSearchResults([]);
    setShowSearchResults(false);
    navigate(`/novel/${novelId}`);
  };

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

  // Đóng search dropdown khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".search-box") && !e.target.closest(".search-results")) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <header className={`header-main ${isHidden ? "header-hidden" : ""}`}>
      {/* TOP */}
      <div className="header-top">
        <Link to="/" className="logo"><img src={logoImg} alt="LightNovelVN" style={{height: "40px"}} /></Link>

        <nav className="nav-main">
          <Link to="/">Trang chủ</Link>
        </nav>

        <div className="header-right">
          <div style={{ position: "relative", width: "220px" }}>
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="search-box"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => searchResults.length > 0 && setShowSearchResults(true)}
            />
            {showSearchResults && searchResults.length > 0 && (
              <div 
                className="search-results"
                style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                background: "#1a1d23",
                border: "1px solid #242b36",
                borderRadius: "0.5rem",
                maxHeight: "300px",
                overflowY: "auto",
                zIndex: 1000,
                marginTop: "0.5rem",
                boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
              }}>
                {searchResults.map((novel) => (
                  <div
                    key={novel.idln}
                    onClick={() => handleSelectResult(novel.idln)}
                    style={{
                      padding: "0.75rem 1rem",
                      cursor: "pointer",
                      borderBottom: "1px solid #242b36",
                      transition: "background 0.2s",
                      color: "#c7d0db",
                      fontSize: "0.9rem"
                    }}
                    onMouseOver={(e) => e.target.style.background = "#242b36"}
                    onMouseOut={(e) => e.target.style.background = "transparent"}
                  >
                    <div style={{ fontWeight: "500" }}>{novel.title}</div>
                    <div style={{ fontSize: "0.8rem", color: "#94a3b8" }}>{novel.author || "Ẩn danh"}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {user ? (
            <div className="user-menu" style={{position: 'relative'}}>
              <button
                className="user-avatar-btn"
                style={{
                  background: userDropdown ? '#23272f' : 'none',
                  border: 'none',
                  color: '#fbbf24',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  padding: '4px 16px 4px 8px',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: userDropdown ? '0 2px 12px rgba(0,0,0,0.18)' : 'none',
                  transition: 'background 0.2s',
                }}
                onClick={() => setUserDropdown((v) => !v)}
                onBlur={() => setTimeout(() => setUserDropdown(false), 180)}
              >
                <span style={{
                  background: '#fbbf24',
                  color: '#23272f',
                  borderRadius: '50%',
                  width: 28,
                  height: 28,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.12)'
                }}>{user.username?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || '?'}</span>
                <span style={{fontWeight: 'bold', color: '#fbbf24', fontSize: '1rem'}}>{user.username || user.email}</span>
                <span style={{fontWeight: 'normal', color: '#fff', fontSize: '1.1em'}}>{userDropdown ? '▴' : '▾'}</span>
              </button>
              {userDropdown && (
                <div
                  className="user-dropdown"
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: '110%',
                    background: '#23272f',
                    borderRadius: '8px',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.18)',
                    minWidth: '180px',
                    zIndex: 1000,
                    padding: '8px 0',
                  }}
                >
                  <button className="user-dropdown-item" style={{display:'flex',alignItems:'center',width:'100%',background:'none',border:'none',color:'#fff',padding:'10px 20px',fontSize:'1rem',cursor:'pointer',textAlign:'left',gap:8}}>
                    <span style={{marginRight:0}}> <svg width="18" height="18" fill="#a78bfa" viewBox="0 0 24 24"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg></span> Tài khoản
                  </button>
                  <button className="user-dropdown-item" style={{display:'flex',alignItems:'center',width:'100%',background:'none',border:'none',color:'#fff',padding:'10px 20px',fontSize:'1rem',cursor:'pointer',textAlign:'left',gap:8}}>
                    <span style={{marginRight:0}}><svg width="18" height="18" fill="#f472b6" viewBox="0 0 24 24"><path d="M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm0-6C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13h-1v6l5.25 3.15.77-1.28-4.52-2.67V7z"/></svg></span> Lịch sử
                  </button>
                  <button className="user-dropdown-item" style={{display:'flex',alignItems:'center',width:'100%',background:'none',border:'none',color:'#fff',padding:'10px 20px',fontSize:'1rem',cursor:'pointer',textAlign:'left',gap:8}} onClick={handleLogout}>
                    <span style={{marginRight:0}}><svg width="18" height="18" fill="#60a5fa" viewBox="0 0 24 24"><path d="M16 13v-2H7V8l-5 4 5 4v-3zM20 3h-8c-1.1 0-2 .9-2 2v4h2V5h8v14h-8v-4h-2v4c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/></svg></span> Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn-login">Đăng nhập</Link>
          )}
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
                    <button className="header-info-item" style={{width:'100%',background:'none',border:'none',color:'#fff',padding:'10px 20px',fontSize:'1rem',cursor:'pointer',textAlign:'left'}}
                      onClick={() => {
                        setActiveTab("thongtin"); setInfoOpen(false);
                        if (!user) {
                          window.alert('Bạn cần đăng nhập để đăng truyện!');
                        } else {
                          navigate('/dang-truyen');
                        }
                      }}
                    >
                      Đăng truyện
                    </button>
                    <div style={{borderTop:'1px solid #333',margin:'4px 0'}}></div>
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
