import { Routes, Route, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

import AlbumsPage from "./pages/AlbumsPage";
import AlbumDetailPage from "./pages/AlbumDetailPage";
import LoginPage from "./pages/LoginPage";
import MyReviewsPage from "./pages/MyReviewsPage.jsx";
import AdminAlbumsPage from "./pages/AdminAlbumsPage";
import LanguageSwitcher from "./components/LanguageSwitcher";
import RegisterPage from "./pages/RegisterPage";

function PillLink({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => (isActive ? "pill pill-active" : "pill")}
      end={to === "/"}
    >
      {children}
    </NavLink>
  );
}

export default function App() {
  const { t } = useTranslation();

  return (
    <div className="container">
      <header className="card navbar">
        <div className="navlinks" style={{ gap: 12 }}>
          <div style={{ fontWeight: 800, letterSpacing: 0.2 }}>
            ListenLog
            <span className="muted" style={{ fontWeight: 600, marginLeft: 8 }}>
              Album Reviews
            </span>
          </div>

          <div className="navlinks" style={{ gap: 10 }}>
            <PillLink to="/">{t("nav.albums")}</PillLink>
            <PillLink to="/my-reviews">{t("nav.myReviews")}</PillLink>
            <PillLink to="/login">{t("nav.login")}</PillLink>
            <PillLink to="/register">{t("auth.register")}</PillLink>
          </div>
        </div>

        <div className="navlinks" style={{ gap: 10 }}>
          <PillLink to="/admin/albums">{t("nav.adminAlbums")}</PillLink>
          <LanguageSwitcher />
        </div>
      </header>

      <hr />

      <main className="card card-pad">
        <Routes>
          <Route path="/" element={<AlbumsPage />} />
          <Route path="/albums/:id" element={<AlbumDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/my-reviews" element={<MyReviewsPage />} />
          <Route path="/admin/albums" element={<AdminAlbumsPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </main>
    </div>
  );
}
