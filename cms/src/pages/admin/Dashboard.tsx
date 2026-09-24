import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getBlogs } from "../../api/blogs";
import { getProjects } from "../../api/projects";
import { getSkills } from "../../api/skills";
import { getTestimonials } from "../../api/testimonials";

interface DashboardStats {
  projects: number;
  skills: number;
  blogs: number;
  testimonials: number;
}

const quickActions = [
  {
    title: "Manage Projects",
    description: "Add, edit, or remove portfolio projects.",
    path: "/admin/projects",
  },
  {
    title: "Manage Skills",
    description: "Maintain your technical skills and proficiency.",
    path: "/admin/skills",
  },
  {
    title: "Manage Blog",
    description: "Create and manage your portfolio articles.",
    path: "/admin/blogs",
  },
  {
    title: "Manage About",
    description: "Update your profile and contact information.",
    path: "/admin/about",
  },
];

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(
    null,
  );

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardStats = async () => {
      try {
        const [
          projectsResponse,
          skillsResponse,
          blogsResponse,
          testimonialsResponse,
        ] = await Promise.all([
          getProjects(1, 0),
          getSkills(1, 1),
          getBlogs(),
          getTestimonials(),
        ]);

        setStats({
          projects: projectsResponse.total,
          skills: skillsResponse.total,
          blogs: blogsResponse.length,
          testimonials: testimonialsResponse.length,
        });
      } catch (error) {
        console.error(
          "Failed to load dashboard statistics:",
          error,
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboardStats();
  }, []);

  const statCards = [
    {
      label: "Projects",
      value: stats?.projects,
      description: "Portfolio projects",
      path: "/admin/projects",
    },
    {
      label: "Skills",
      value: stats?.skills,
      description: "Technical skills",
      path: "/admin/skills",
    },
    {
      label: "Blog Posts",
      value: stats?.blogs,
      description: "Articles and posts",
      path: "/admin/blogs",
    },
    {
      label: "Testimonials",
      value: stats?.testimonials,
      description: "Client testimonials",
      path: "/admin/testimonials",
    },
  ];

  return (
    <div className="dashboard-page">
      <section className="dashboard-header">
        <div>
          <p className="dashboard-eyebrow">
            ADMINISTRATION
          </p>

          <h1>Dashboard</h1>

          <p className="dashboard-description">
            Manage your portfolio content from one place.
          </p>
        </div>
      </section>

      <section className="dashboard-stats">
        {statCards.map((stat) => (
          <Link
            key={stat.label}
            to={stat.path}
            className="dashboard-stat"
          >
            <div className="dashboard-stat-top">
              <span className="dashboard-stat-label">
                {stat.label}
              </span>

              <span className="dashboard-stat-arrow">
                →
              </span>
            </div>

            <strong className="dashboard-stat-value">
              {loading ? "..." : stat.value ?? "—"}
            </strong>

            <span className="dashboard-stat-description">
              {stat.description}
            </span>
          </Link>
        ))}
      </section>

      <section className="dashboard-section">
        <div className="dashboard-section-header">
          <div>
            <h2>Quick actions</h2>

            <p>
              Jump directly to the areas you manage most often.
            </p>
          </div>
        </div>

        <div className="dashboard-actions">
          {quickActions.map((action) => (
            <Link
              key={action.title}
              to={action.path}
              className="dashboard-action"
            >
              <div>
                <h3>{action.title}</h3>

                <p>{action.description}</p>
              </div>

              <span className="dashboard-action-arrow">
                →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="dashboard-section">
        <div className="dashboard-section-header">
          <div>
            <h2>Content overview</h2>

            <p>
              Use the sidebar to manage the remaining portfolio
              sections.
            </p>
          </div>
        </div>

        <div className="dashboard-overview">
          <div className="dashboard-overview-item">
            <span>About</span>
            <Link to="/admin/about">Manage →</Link>
          </div>

          <div className="dashboard-overview-item">
            <span>Experience</span>
            <Link to="/admin/experience">Manage →</Link>
          </div>

          <div className="dashboard-overview-item">
            <span>Services</span>
            <Link to="/admin/services">Manage →</Link>
          </div>

          <div className="dashboard-overview-item">
            <span>Uploads</span>
            <Link to="/admin/uploads">Manage →</Link>
          </div>
        </div>
      </section>
    </div>
  );
}