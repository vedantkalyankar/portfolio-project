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

const emptyForm: ProjectCreateRequest = {
  title: "",
  description: "",
  github_url: "",
  live_url: "",
};

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] =
    useState<ProjectCreateRequest>(emptyForm);

  const [editingId, setEditingId] = useState<string | null>(
    null,
  );

  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);

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
        setSuccess("Project updated successfully.");
      } else {
        await createProject(form);
        setSuccess("Project created successfully.");
      }

      setForm(emptyForm);
      setEditingId(null);

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

      setSuccess("Project deleted successfully.");

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

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setSuccess("");
  };

  return (
    <div>
      <h1>Projects</h1>

      {error && <p>{error}</p>}
      {success && <p>{success}</p>}

      <section>
        <h2>
          {editingId ? "Edit Project" : "Add Project"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div>
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
              required
            />
          </div>

          <div>
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
              rows={6}
              required
            />
          </div>

          <div>
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
              required
            />
          </div>

          <div>
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
              required
            />
          </div>

          <button type="submit" disabled={saving}>
            {saving
              ? "Saving..."
              : editingId
                ? "Update Project"
                : "Add Project"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              disabled={saving}
            >
              Cancel
            </button>
          )}
        </form>
      </section>

      <section>
        <h2>Project List</h2>

        {loading ? (
          <p>Loading projects...</p>
        ) : projects.length === 0 ? (
          <p>No projects found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>GitHub</th>
                <th>Live</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {projects.map((project) => (
                <tr key={project.id}>
                  <td>{project.title}</td>

                  <td>{project.description}</td>

                  <td>
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      GitHub
                    </a>
                  </td>

                  <td>
                    <a
                      href={project.live_url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Live
                    </a>
                  </td>

                  <td>
                    <button
                      type="button"
                      onClick={() =>
                        handleEdit(project)
                      }
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(project.id)
                      }
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {total > limit && (
        <div>
          <button
            type="button"
            disabled={!hasPrevious}
            onClick={() =>
              setOffset((current) =>
                Math.max(0, current - limit),
              )
            }
          >
            Previous
          </button>

          <span>
            Showing {offset + 1}-
            {Math.min(offset + limit, total)} of {total}
          </span>

          <button
            type="button"
            disabled={!hasNext}
            onClick={() =>
              setOffset((current) =>
                current + limit,
              )
            }
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}