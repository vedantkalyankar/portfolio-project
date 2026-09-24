import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import {
  createProject,
  deleteProject,
  getProjects,
  updateProject,
  type Project,
  type ProjectCreateRequest,
} from "../../api/projects";

const EMPTY_FORM: ProjectCreateRequest = {
  title: "",
  description: "",
  github_url: "",
  live_url: "",
};

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);

  const [form, setForm] =
    useState<ProjectCreateRequest>(EMPTY_FORM);

  const [editingId, setEditingId] = useState<string | null>(
    null,
  );

  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);

  const [showForm, setShowForm] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const limit = 10;

  const hasPrevious = offset > 0;
  const hasNext = offset + limit < total;

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getProjects(limit, offset);

      setProjects(response.items);
      setTotal(response.total);
    } catch {
      setError("Failed to load projects.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, [offset]);

  const handleChange = (
    field: keyof ProjectCreateRequest,
    value: string,
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setSuccess("");
  };

  const openAddForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setError("");
    setSuccess("");
    setShowForm(true);
  };

  const cancelForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setError("");
    setSuccess("");
    setShowForm(false);
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (editingId) {
        await updateProject(editingId, form);

        setSuccess(
          "Project updated successfully.",
        );
      } else {
        await createProject(form);

        setSuccess(
          "Project created successfully.",
        );
      }

      setForm(EMPTY_FORM);
      setEditingId(null);
      setShowForm(false);

      await loadProjects();
    } catch {
      setError(
        editingId
          ? "Failed to update project."
          : "Failed to create project.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingId(project.id);

    setForm({
      title: project.title,
      description: project.description,
      github_url: project.github_url,
      live_url: project.live_url,
    });

    setError("");
    setSuccess("");
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await deleteProject(id);

      setSuccess(
        "Project deleted successfully.",
      );

      if (projects.length === 1 && offset > 0) {
        setOffset((current) =>
          Math.max(0, current - limit),
        );
      } else {
        await loadProjects();
      }
    } catch {
      setError("Failed to delete project.");
    }
  };

  return (
    <div className="crud-page">
      {!showForm ? (
        <>
          <section className="crud-header">
            <div>
              <p className="crud-eyebrow">
                PORTFOLIO CONTENT
              </p>

              <h1>Projects</h1>

              <p className="crud-description">
                Manage the projects displayed on your
                portfolio.
              </p>
            </div>

            <div className="crud-header-action">
              <button
                type="button"
                className="crud-button crud-button-primary"
                onClick={openAddForm}
              >
                + Add Project
              </button>
            </div>
          </section>

          {error && (
            <div
              className="crud-message crud-message-error"
              role="alert"
            >
              {error}
            </div>
          )}

          {success && (
            <div
              className="crud-message crud-message-success"
              role="status"
            >
              {success}
            </div>
          )}

          <section className="crud-list-section">
            <div className="crud-section-header">
              <div>
                <h2>Project list</h2>

                <p>
                  View and manage your existing portfolio
                  projects.
                </p>
              </div>

              <div className="crud-section-count">
                {total}{" "}
                {total === 1
                  ? "project"
                  : "projects"}
              </div>
            </div>

            {loading ? (
              <div className="crud-state">
                <p>Loading projects...</p>
              </div>
            ) : projects.length === 0 ? (
              <div className="crud-state">
                <h3>No projects yet</h3>

                <p>
                  Add your first project using the
                  button above.
                </p>
              </div>
            ) : (
              <div className="crud-table-wrapper">
                <table className="crud-table">
                  <thead>
                    <tr>
                      <th>Project</th>
                      <th>Description</th>
                      <th>Links</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {projects.map((project) => (
                      <tr key={project.id}>
                        <td>
                          <div className="crud-project-title">
                            {project.title}
                          </div>
                        </td>

                        <td>
                          <div className="crud-project-description">
                            {project.description}
                          </div>
                        </td>

                        <td>
                          <div className="crud-project-links">
                            <a
                              href={project.github_url}
                              target="_blank"
                              rel="noreferrer"
                            >
                              GitHub ↗
                            </a>

                            <a
                              href={project.live_url}
                              target="_blank"
                              rel="noreferrer"
                            >
                              Live ↗
                            </a>
                          </div>
                        </td>

                        <td>
                          <div className="crud-row-actions">
                            <button
                              type="button"
                              className="crud-button crud-button-small"
                              onClick={() =>
                                handleEdit(project)
                              }
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              className="crud-button crud-button-small crud-button-danger"
                              onClick={() =>
                                handleDelete(project.id)
                              }
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {total > limit && (
            <div className="crud-pagination">
              <button
                type="button"
                className="crud-button crud-button-secondary"
                disabled={!hasPrevious}
                onClick={() =>
                  setOffset((current) =>
                    Math.max(0, current - limit),
                  )
                }
              >
                ← Previous
              </button>

              <span>
                Showing{" "}
                <strong>{offset + 1}</strong>-
                <strong>
                  {Math.min(
                    offset + limit,
                    total,
                  )}
                </strong>{" "}
                of <strong>{total}</strong>
              </span>

              <button
                type="button"
                className="crud-button crud-button-secondary"
                disabled={!hasNext}
                onClick={() =>
                  setOffset(
                    (current) =>
                      current + limit,
                  )
                }
              >
                Next →
              </button>
            </div>
          )}
        </>
      ) : (
        <>
          <section className="crud-header">
            <div>
              <p className="crud-eyebrow">
                PORTFOLIO CONTENT
              </p>

              <h1>
                {editingId
                  ? "Edit Project"
                  : "Add Project"}
              </h1>

              <p className="crud-description">
                {editingId
                  ? "Update the project information below."
                  : "Add a new project to your portfolio."}
              </p>
            </div>
          </section>

          {error && (
            <div
              className="crud-message crud-message-error"
              role="alert"
            >
              {error}
            </div>
          )}

          {success && (
            <div
              className="crud-message crud-message-success"
              role="status"
            >
              {success}
            </div>
          )}

          <section className="crud-form-section">
            <div className="crud-section-header">
              <div>
                <h2>Project details</h2>

                <p>
                  Enter the details of your portfolio
                  project.
                </p>
              </div>
            </div>

            <form
              className="crud-form"
              onSubmit={handleSubmit}
            >
              <div className="crud-form-grid">
                <div className="crud-field">
                  <label htmlFor="project-title">
                    Title
                  </label>

                  <input
                    id="project-title"
                    type="text"
                    value={form.title}
                    onChange={(event) =>
                      handleChange(
                        "title",
                        event.target.value,
                      )
                    }
                    placeholder="Enter project title"
                    required
                  />
                </div>

                <div className="crud-field">
                  <label htmlFor="project-github">
                    GitHub URL
                  </label>

                  <input
                    id="project-github"
                    type="url"
                    value={form.github_url}
                    onChange={(event) =>
                      handleChange(
                        "github_url",
                        event.target.value,
                      )
                    }
                    placeholder="https://github.com/..."
                    required
                  />
                </div>

                <div className="crud-field">
                  <label htmlFor="project-live">
                    Live URL
                  </label>

                  <input
                    id="project-live"
                    type="url"
                    value={form.live_url}
                    onChange={(event) =>
                      handleChange(
                        "live_url",
                        event.target.value,
                      )
                    }
                    placeholder="https://..."
                    required
                  />
                </div>
              </div>

              <div className="crud-field">
                <label htmlFor="project-description">
                  Description
                </label>

                <textarea
                  id="project-description"
                  value={form.description}
                  onChange={(event) =>
                    handleChange(
                      "description",
                      event.target.value,
                    )
                  }
                  rows={8}
                  placeholder="Describe the project, technologies used, and its purpose."
                  required
                />
              </div>

              <div className="crud-form-actions">
                <button
                  type="submit"
                  className="crud-button crud-button-primary"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Update Project"
                      : "Add Project"}
                </button>

                <button
                  type="button"
                  className="crud-button crud-button-secondary"
                  onClick={cancelForm}
                  disabled={saving}
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        </>
      )}
    </div>
  );
}
