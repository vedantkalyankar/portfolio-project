import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Contact from "./pages/portfolio/Contact";
import Blog from "./pages/portfolio/Blog";
import BlogDetail from "./pages/portfolio/BlogDetail";
import Testimonials  from "./pages/portfolio/Testimonials";
import Services from "./pages/portfolio/Services";
import Experience from "./pages/portfolio/Experience";
import Skills from "./pages/portfolio/Skills";
import Projects from "./pages/portfolio/Projects";
import About from "./pages/portfolio/About";
import PortfolioLayout from "./layouts/PortfolioLayout";
import Home from "./pages/portfolio/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PortfolioLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/services" element={<Services />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/contact" element={<Contact />} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;