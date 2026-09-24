import { useEffect, useState } from "react";

import {
  getProjects,
  type Project,
} from "../../api/projects";
import Container from "../../components/portfolio/Container";

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await getProjects(
  pageSize,
  page * pageSize,
);

setProjects(data.items);
setTotal(data.total);
        setProjects(data.items);
      } catch {
        setError("Unable to load projects.");
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, [page]);

  if (loading) {
    return (
      <section className="py-20">
        <Container>
          <p className="text-gray-500">Loading...</p>
        </Container>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20">
        <Container>
          <p className="text-gray-500">{error}</p>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-20">
      <Container>
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
            Projects
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            Selected Projects
          </h1>
        </div>

        <div className="mt-12 grid gap-10 md:grid-cols-2">
          {projects.map((project) => (
            <article
              key={project.id}
              className="border-b border-gray-200 pb-8"
            >
              <h2 className="text-2xl font-semibold">
                {project.title}
              </h2>

              <p className="mt-4 leading-7 text-gray-600">
                {project.description}
              </p>

              <div className="mt-6 flex gap-5 text-sm">
                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-gray-900 hover:text-gray-600"
                  >
                    GitHub
                  </a>
                )}

                {project.live_url && (
                  <a
                    href={project.live_url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-gray-900 hover:text-gray-600"
                  >
                    Live Demo
                  </a>
                )}
              </div>
            </article>
          ))}

          {projects.length === 0 && (
            <p className="text-gray-500">
              No projects available.
            </p>
          )}
        </div>
        {total > pageSize && (
  <div className="mt-12 flex items-center justify-between border-t border-gray-200 pt-6">
    <button
      type="button"
      onClick={() => setPage((current) => current - 1)}
      disabled={page === 0}
      className="border border-gray-300 px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40"
    >
      Previous
    </button>

    <p className="text-sm text-gray-500">
      Page {page + 1} of {Math.ceil(total / pageSize)}
    </p>

    <button
      type="button"
      onClick={() => setPage((current) => current + 1)}
      disabled={(page + 1) * pageSize >= total}
      className="border border-gray-300 px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40"
    >
      Next
    </button>
  </div>
)}
      </Container>
    </section>
  );
}