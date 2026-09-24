import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";

import InteractionEffects from "../components/portfolio/InteractionEffects";
import AnimatedBackground from "../components/portfolio/AnimatedBackground";
import Container from "../components/portfolio/Container";

const navigation = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Skills", path: "/skills" },
  { label: "Experience", path: "/experience" },
  { label: "Projects", path: "/projects" },
  { label: "Services", path: "/services" },
  { label: "Testimonials", path: "/testimonials" },
  { label: "Blog", path: "/blog" },
  { label: "Contact", path: "/contact" },
];

export default function PortfolioLayout() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <AnimatedBackground />
      <InteractionEffects />
      <header className="border-b border-gray-200">
        <Container>
          <div className="flex items-center justify-between py-4">
            <NavLink
              to="/"
              className="shrink-0 text-xl font-bold"
              onClick={() => setMenuOpen(false)}
            >
              Portfolio
            </NavLink>

            {/* Desktop Navigation */}
            <nav className="hidden items-center gap-5 lg:flex">
              {navigation.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `whitespace-nowrap text-sm transition ${
                      isActive
                        ? "font-semibold text-black"
                        : "text-gray-600 hover:text-black"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center border border-gray-300 lg:hidden"
              onClick={() =>
                setMenuOpen((open) => !open)
              }
              aria-label={
                menuOpen ? "Close menu" : "Open menu"
              }
              aria-expanded={menuOpen}
            >
              <span className="text-2xl">
                {menuOpen ? "×" : "☰"}
              </span>
            </button>
          </div>
        </Container>

        {/* Mobile Navigation */}
        {menuOpen && (
          <nav className="border-t border-gray-200 lg:hidden">
            <Container>
              <div className="py-3">
                {navigation.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      `block border-b border-gray-100 py-3 text-sm ${
                        isActive
                          ? "font-semibold text-black"
                          : "text-gray-600 hover:text-black"
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </Container>
          </nav>
        )}
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="border-t border-gray-200">
        <Container>
          <div className="py-6 text-sm text-gray-500">
            © {new Date().getFullYear()} Portfolio. All rights reserved.
          </div>
        </Container>
      </footer>
    </div>
  );
}