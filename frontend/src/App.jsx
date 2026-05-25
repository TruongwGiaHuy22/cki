import XuatBan from "./pages/xuatban.jsx";
import './App.css';
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Header from "./compoment/header.jsx";
import Footer from "./compoment/footer.jsx";
import Home from "./pages/home.jsx";
import LoginPage from "./pages/login.jsx";
import Novels from "./pages/novels.jsx";
import NovelDetail from "./pages/novelsdetail.jsx";
import ChapterReader from "./pages/chapterreader.jsx";
import DanhSach from "./pages/danhsach.jsx";
import Register from "./pages/dangki.jsx";
import DanhSachSangTac from "./pages/DanhSachSangtac.jsx";
import DanhSachAI from "./pages/DanhSachAI.jsx";
import DangTruyen from "./pages/DangTruyen.jsx";
import QuanLyTruyen from "./pages/quanlytruyen.jsx";
import Introduction from "./compoment/Introduction.jsx";
import ErrorReport from "./compoment/ErrorReport.jsx";
import TermsOfService from "./compoment/TermsOfService.jsx";
import PrivacyPolicy from "./compoment/PrivacyPolicy.jsx";
import ForumCreate from "./pages/ForumCreate.jsx";
function AppLayout() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  const isRegisterPage = location.pathname === "/register";
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {!isLoginPage && !isRegisterPage && <Header />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/novels" element={<Novels />} />
          <Route path="/novel/:id" element={<NovelDetail />} />
          <Route path="/chapter/:id" element={<ChapterReader />} />
          <Route path="/danhsach" element={<DanhSach />} />
          <Route path="/register" element={<Register />} />
          <Route path="/sangtac" element={<DanhSachSangTac />} />
          <Route path="/ai" element={<DanhSachAI />} />
          <Route path="/xuatban" element={<XuatBan />} />
          <Route path="/dang-truyen" element={<DangTruyen />} />
          <Route path="/quan-ly-truyen" element={<QuanLyTruyen />} />
          <Route path="/introduction" element={<Introduction />} />
          <Route path="/error-report" element={<ErrorReport />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/forum/create" element={<ForumCreate />} />
        </Routes>
      </main>
      {!isLoginPage && !isRegisterPage && <Footer />}
    </div>
  );
}



export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}
