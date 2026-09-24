import { NavLink, Outlet, useNavigate } from "react-router-dom";

import { useAuth } from "../auth/AuthContext";

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div>
      <header>
        <strong>Portfolio CMS</strong>

        <button
  onClick={() => {
    logout();
    navigate("/login", { replace: true });
  }}
>
  Logout
</button>
      </header>

      <div>
        <aside>
          <nav>
            <NavLink to="/admin">Dashboard</NavLink>
            <NavLink to="/admin/about">About</NavLink>
            <NavLink to="/admin/skills">Skills</NavLink>
            <NavLink to="/admin/projects">Projects</NavLink>
            <NavLink to="/admin/blogs">Blogs</NavLink>
            <NavLink to="/admin/experience">Experience</NavLink>
            <NavLink to="/admin/testimonials">
              Testimonials
            </NavLink>
            <NavLink to="/admin/services">Services</NavLink>
            <NavLink to="/admin/uploads">Uploads</NavLink>
          </nav>
        </aside>

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}