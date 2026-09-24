import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

import { useAuth } from "../auth/AuthContext";

const navigation = [
  { label: "Dashboard", path: "/admin" },
  { label: "About", path: "/admin/about" },
  { label: "Skills", path: "/admin/skills" },
  { label: "Projects", path: "/admin/projects" },
  { label: "Blogs", path: "/admin/blogs" },
  { label: "Experience", path: "/admin/experience" },
  { label: "Testimonials", path: "/admin/testimonials" },
  { label: "Services", path: "/admin/services" },
  { label: "Uploads", path: "/admin/uploads" },
];

export default function AdminLayout() {
  const { logout, username } = useAuth();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <div className="admin-shell">
      <header className="admin-header">
        <div className="admin-header-left">
          <button
            type="button"
            className="admin-menu-button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            <span>{menuOpen ? "×" : "☰"}</span>
          </button>

          <div className="admin-brand">
            <span>CMS</span>
          </div>
        </div>

        <div className="admin-header-actions">
          {username && (
            <span className="admin-username">
              {username}
            </span>
          )}

          <button
            type="button"
            className="admin-logout"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </header>

      <div className="admin-body">
        {menuOpen && (
          <button
            type="button"
            className="admin-overlay"
            onClick={closeMenu}
            aria-label="Close navigation"
          />
        )}

        <aside
          className={`admin-sidebar${
            menuOpen ? " mobile-open" : ""
          }`}
        >
          <nav
            className="admin-nav"
            aria-label="Admin navigation"
          >
            {navigation.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/admin"}
                onClick={closeMenu}
                className={({ isActive }) =>
                  `admin-nav-link${
                    isActive ? " active" : ""
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}