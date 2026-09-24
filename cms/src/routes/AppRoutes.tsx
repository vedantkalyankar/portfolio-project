import { Navigate, Route, Routes } from "react-router-dom";

import Uploads from "../pages/admin/Uploads";
import Services from "../pages/admin/Services";
import Testimonials from "../pages/admin/Testimonials";
import Blogs from "../pages/admin/Blogs";
import Experience from "../pages/admin/Experience";
import Projects from "../pages/admin/Projects";
import Login from "../pages/auth/Login";
import Dashboard from "../pages/admin/Dashboard";
import AdminLayout from "../layouts/AdminLayout";
import About from "../pages/admin/About";
import Skills from "../pages/admin/Skills";
import { useAuth } from "../auth/AuthContext";

function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="about" element={<About />} />
        <Route path="skills" element={<Skills />} />
        <Route path="projects" element={<Projects />} />
        <Route path="blogs" element={<Blogs />} />
        <Route path="experience" element={<Experience />} />
        <Route path="testimonials" element={<Testimonials />} />
        <Route path="services" element={<Services />} />
        <Route path="uploads" element={<Uploads />} />
      </Route>

      <Route
        path="*"
        element={<Navigate to="/admin" replace />}
      />
    </Routes>
  );
}