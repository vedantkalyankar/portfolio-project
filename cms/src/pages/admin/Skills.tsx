import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import {
  createSkill,
  deleteSkill,
  getSkills,
  updateSkill,
  type Skill,
  type SkillCreateRequest,
} from "../../api/skills";

const SKILL_NAMES = [
  "Python",
  "Java",
  "JavaScript",
  "TypeScript",
  "C",
  "C++",
  "C#",
  "Go",
  "Rust",
  "Kotlin",
  "Swift",
  "PHP",
  "Ruby",
  "Dart",
  "HTML",
  "CSS",
  "SQL",
  "Bash",
  "Shell Scripting",
  "React",
  "Angular",
  "Vue.js",
  "Next.js",
  "Node.js",
  "Express.js",
  "Django",
  "Django REST Framework",
  "FastAPI",
  "Flask",
  "Spring",
  "Spring Boot",
  "Hibernate",
  "JPA",
  "ASP.NET",
  "Laravel",
  "Ruby on Rails",
  "Tailwind CSS",
  "Bootstrap",
  "Material UI",
  "Redux",
  "React Query",
  "GraphQL",
  "REST API",
  "Microservices",
  "WebSockets",
  "PostgreSQL",
  "MySQL",
  "SQLite",
  "MongoDB",
  "Redis",
  "Oracle",
  "SQL Server",
  "Cassandra",
  "Elasticsearch",
  "DynamoDB",
  "Firebase",
  "AWS",
  "Microsoft Azure",
  "Google Cloud Platform",
  "Docker",
  "Kubernetes",
  "Jenkins",
  "GitHub Actions",
  "GitLab CI/CD",
  "Terraform",
  "Ansible",
  "Linux",
  "Git",
  "GitHub",
  "GitLab",
  "Bitbucket",
  "Postman",
  "Swagger",
  "OpenAPI",
  "PyTest",
  "Jest",
  "JUnit",
  "TestNG",
  "Selenium",
  "Cypress",
  "Playwright",
  "Machine Learning",
  "Deep Learning",
  "Artificial Intelligence",
  "Generative AI",
  "Natural Language Processing",
  "Computer Vision",
  "LLM",
  "RAG",
  "LangChain",
  "LlamaIndex",
  "OpenAI API",
  "Hugging Face",
  "TensorFlow",
  "PyTorch",
  "Scikit-learn",
  "Pandas",
  "NumPy",
  "Matplotlib",
  "Seaborn",
  "Apache Spark",
  "Kafka",
  "RabbitMQ",
  "Celery",
];

const SKILL_CATEGORIES = [
  "Programming Language",
  "Frontend",
  "Backend",
  "Database",
  "Cloud",
  "DevOps",
  "Testing",
  "AI / ML",
  "Data",
  "Tools",
  "Other",
];

const PROFICIENCY_OPTIONS = [
  "Beginner",
  "Intermediate",
  "Advanced",
  "Expert",
];

const EMPTY_FORM: SkillCreateRequest = {
  name: "",
  category: "",
  proficiency: "",
};

export default function Skills() {
  const [skills, setSkills] = useState<Skill[]>([]);

  const [form, setForm] =
    useState<SkillCreateRequest>(EMPTY_FORM);

  const [editingId, setEditingId] = useState<string | null>(
    null,
  );

  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [showForm, setShowForm] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadSkills = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getSkills(
        page,
        pageSize,
      );

      setSkills(response.items);
      setTotal(response.total);
      setTotalPages(response.total_pages);
    } catch {
      setError("Failed to load skills.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSkills();
  }, [page, pageSize]);

  const handleChange = (
    field: keyof SkillCreateRequest,
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
        await updateSkill(editingId, form);

        setSuccess(
          "Skill updated successfully.",
        );
      } else {
        await createSkill(form);

        setSuccess(
          "Skill created successfully.",
        );
      }

      setForm(EMPTY_FORM);
      setEditingId(null);
      setShowForm(false);

      await loadSkills();
    } catch {
      setError(
        editingId
          ? "Failed to update skill."
          : "Failed to create skill.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (skill: Skill) => {
  setForm({
    name: skill.name,
    category: skill.category,
    proficiency: skill.proficiency,
  });

  setEditingId(skill.id);
  setError("");
  setSuccess("");
  setShowForm(true);
};

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this skill?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await deleteSkill(id);

      setSuccess(
        "Skill deleted successfully.",
      );

      if (skills.length === 1 && page > 1) {
        setPage((current) =>
          Math.max(1, current - 1),
        );
      } else {
        await loadSkills();
      }
    } catch {
      setError("Failed to delete skill.");
    }
  };

  return (
    <div className="crud-page">
      {!showForm ? (
        <>
          <section className="crud-header">
            <div>
              <p className="crud-eyebrow">
                TECHNICAL PROFILE
              </p>

              <h1>Skills</h1>

              <p className="crud-description">
                Manage the technical skills displayed on
                your portfolio.
              </p>
            </div>

            <div className="crud-header-action">
              <button
                type="button"
                className="crud-button crud-button-primary"
                onClick={openAddForm}
              >
                + Add Skill
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
                <h2>Skill list</h2>

                <p>
                  View and manage your technical skills
                  and proficiency levels.
                </p>
              </div>

              <div className="crud-section-count">
                {total}{" "}
                {total === 1
                  ? "skill"
                  : "skills"}
              </div>
            </div>

            {loading ? (
              <div className="crud-state">
                <p>Loading skills...</p>
              </div>
            ) : skills.length === 0 ? (
              <div className="crud-state">
                <h3>No skills yet</h3>

                <p>
                  Add your first skill using the button
                  above.
                </p>
              </div>
            ) : (
              <div className="crud-table-wrapper">
                <table className="crud-table">
                  <thead>
                    <tr>
                      <th>Skill</th>
                      <th>Category</th>
                      <th>Proficiency</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {skills.map((skill) => (
                      <tr key={skill.id}>
                        <td>
                          <div className="crud-project-title">
                            {skill.name}
                          </div>
                        </td>

                        <td>
                          <span className="crud-skill-category">
                            {skill.category}
                          </span>
                        </td>

                        <td>
                          <span className="crud-skill-proficiency">
                            {skill.proficiency}
                          </span>
                        </td>

                        <td>
                          <div className="crud-row-actions">
                            <button
                              type="button"
                              className="crud-button crud-button-small"
                              onClick={() =>
                                handleEdit(
                                  skill
                                )
                              }
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              className="crud-button crud-button-small crud-button-danger"
                              onClick={() =>
                                handleDelete(
                                  skill.id,
                                )
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

          {totalPages > 1 && (
            <div className="crud-pagination">
              <button
                type="button"
                className="crud-button crud-button-secondary"
                disabled={page <= 1}
                onClick={() =>
                  setPage((current) =>
                    Math.max(1, current - 1),
                  )
                }
              >
                ← Previous
              </button>

              <span>
                Page <strong>{page}</strong> of{" "}
                <strong>{totalPages}</strong>
              </span>

              <button
                type="button"
                className="crud-button crud-button-secondary"
                disabled={page >= totalPages}
                onClick={() =>
                  setPage((current) =>
                    Math.min(
                      totalPages,
                      current + 1,
                    ),
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
                TECHNICAL PROFILE
              </p>

              <h1>
                {editingId
                  ? "Edit Skill"
                  : "Add Skill"}
              </h1>

              <p className="crud-description">
                {editingId
                  ? "Update the skill information below."
                  : "Add a new technical skill to your portfolio."}
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
                <h2>Skill details</h2>

                <p>
                  Enter the details of your technical
                  skill.
                </p>
              </div>
            </div>

            <form
              className="crud-form"
              onSubmit={handleSubmit}
            >
              <div className="crud-form-grid">
                <div className="crud-field">
                  <label htmlFor="skill-name">
                    Skill
                  </label>

                  <select
                    id="skill-name"
                    value={form.name}
                    onChange={(event) =>
                      handleChange(
                        "name",
                        event.target.value,
                      )
                    }
                    required
                  >
                    <option value="" disabled>
                      Select skill
                    </option>

                    {SKILL_NAMES.map((skill) => (
                      <option
                        key={skill}
                        value={skill}
                      >
                        {skill}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="crud-field">
                  <label htmlFor="skill-category">
                    Category
                  </label>

                  <select
                    id="skill-category"
                    value={form.category}
                    onChange={(event) =>
                      handleChange(
                        "category",
                        event.target.value,
                      )
                    }
                    required
                  >
                    <option value="" disabled>
                      Select category
                    </option>

                    {SKILL_CATEGORIES.map(
                      (category) => (
                        <option
                          key={category}
                          value={category}
                        >
                          {category}
                        </option>
                      ),
                    )}
                  </select>
                </div>

                <div className="crud-field">
                  <label htmlFor="skill-proficiency">
                    Proficiency
                  </label>

                  <select
                    id="skill-proficiency"
                    value={form.proficiency}
                    onChange={(event) =>
                      handleChange(
                        "proficiency",
                        event.target.value,
                      )
                    }
                    required
                  >
                    <option value="" disabled>
                      Select proficiency
                    </option>

                    {PROFICIENCY_OPTIONS.map(
                      (proficiency) => (
                        <option
                          key={proficiency}
                          value={proficiency}
                        >
                          {proficiency}
                        </option>
                      ),
                    )}
                  </select>
                </div>
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
                      ? "Update Skill"
                      : "Add Skill"}
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