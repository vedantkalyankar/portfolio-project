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

const emptyForm: SkillCreateRequest = {
  name: "",
  category: "",
  proficiency: "",
};

const PROFICIENCY_OPTIONS = [
  "Beginner",
  "Intermediate",
  "Advanced",
  "Expert",
];

const SKILL_NAMES = [
  // Programming Languages
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
  "R",
  "Scala",
  "Shell",
  "Bash",
  "PowerShell",

  // Frontend
  "HTML",
  "CSS",
  "Sass",
  "Tailwind CSS",
  "Bootstrap",
  "React",
  "Next.js",
  "Vue.js",
  "Nuxt.js",
  "Angular",
  "Svelte",
  "Redux",
  "React Router",
  "Vite",
  "Webpack",

  // Backend
  "FastAPI",
  "Django",
  "Flask",
  "Django REST Framework",
  "Express.js",
  "NestJS",
  "Spring",
  "Spring Boot",
  "Spring Security",
  "Spring Data JPA",
  "Hibernate",
  "ASP.NET Core",
  "Laravel",
  "Ruby on Rails",

  // APIs & Architecture
  "REST API",
  "GraphQL",
  "WebSocket",
  "gRPC",
  "Microservices",
  "API Gateway",
  "OAuth 2.0",
  "OpenID Connect",
  "JWT",

  // Databases
  "PostgreSQL",
  "MySQL",
  "MariaDB",
  "SQLite",
  "Oracle",
  "SQL Server",
  "MongoDB",
  "Redis",
  "Cassandra",
  "DynamoDB",
  "Elasticsearch",
  "Neo4j",
  "Firebase",

  // Cloud
  "AWS",
  "Amazon EC2",
  "Amazon S3",
  "Amazon RDS",
  "Amazon Lambda",
  "Amazon ECS",
  "Amazon EKS",
  "Amazon CloudFront",
  "Amazon API Gateway",
  "Google Cloud",
  "Google Compute Engine",
  "Google Cloud Storage",
  "Google Cloud Run",
  "Google Kubernetes Engine",
  "Microsoft Azure",
  "Azure App Service",
  "Azure Functions",
  "Azure Kubernetes Service",

  // DevOps & Containers
  "Docker",
  "Docker Compose",
  "Kubernetes",
  "Helm",
  "Jenkins",
  "GitHub Actions",
  "GitLab CI/CD",
  "Argo CD",
  "Terraform",
  "Ansible",
  "Prometheus",
  "Grafana",
  "Nginx",
  "Apache",

  // Version Control
  "Git",
  "GitHub",
  "GitLab",
  "Bitbucket",

  // Testing
  "Selenium",
  "Playwright",
  "Cypress",
  "Pytest",
  "Jest",
  "JUnit",
  "TestNG",
  "Postman",
  "REST Assured",

  // AI / ML
  "Machine Learning",
  "Deep Learning",
  "Artificial Intelligence",
  "Generative AI",
  "Natural Language Processing",
  "Computer Vision",
  "Scikit-learn",
  "TensorFlow",
  "PyTorch",
  "Keras",
  "Pandas",
  "NumPy",
  "Matplotlib",
  "OpenCV",
  "Hugging Face",
  "LangChain",
  "LangGraph",
  "LlamaIndex",
  "RAG",
  "Vector Databases",
  "FAISS",
  "ChromaDB",
  "Pinecone",
  "OpenAI API",

  // Data Engineering
  "Apache Spark",
  "Apache Kafka",
  "Apache Airflow",
  "Databricks",
  "ETL",
  "Data Warehousing",
  "Apache Flink",

  // Messaging & Distributed Systems
  "RabbitMQ",
  "Apache Kafka",
  "Celery",
  "Amazon SQS",
  "Apache ActiveMQ",

  // Tools
  "Linux",
  "Windows",
  "VS Code",
  "IntelliJ IDEA",
  "PyCharm",
  "Jupyter",
  "Swagger",
  "OpenAPI",
  "SonarQube",
  "Maven",
  "Gradle",
  "npm",
  "Yarn",
  "pnpm",
];


const SKILL_CATEGORIES = [
  "Programming Languages",
  "Frontend Development",
  "Backend Development",
  "Full Stack Development",
  "Mobile Development",
  "Web Development",
  "API Development",
  "API & Integration",
  "Software Architecture",
  "Microservices",
  "Database",
  "Relational Database",
  "NoSQL Database",
  "Caching",
  "Cloud Computing",
  "AWS",
  "Microsoft Azure",
  "Google Cloud Platform",
  "DevOps",
  "CI/CD",
  "Containerization",
  "Kubernetes",
  "Infrastructure as Code",
  "Monitoring & Observability",
  "Networking",
  "Security",
  "Authentication & Authorization",
  "Testing",
  "Test Automation",
  "Performance Testing",
  "Artificial Intelligence",
  "Machine Learning",
  "Deep Learning",
  "Generative AI",
  "Natural Language Processing",
  "Computer Vision",
  "Large Language Models",
  "RAG",
  "AI Agents",
  "Vector Databases",
  "Data Science",
  "Data Analysis",
  "Data Engineering",
  "Big Data",
  "Data Visualization",
  "Message Queues",
  "Distributed Systems",
  "Version Control",
  "Build Tools",
  "Package Management",
  "Linux",
  "System Administration",
  "Developer Tools",
  "Project Management",
  "Other",
];
export default function Skills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [form, setForm] =
    useState<SkillCreateRequest>(emptyForm);

  const [editingId, setEditingId] = useState<string | null>(
    null,
  );

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const pageSize = 10;

  const loadSkills = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getSkills(page, pageSize);

      setSkills(response.items);
      setTotalPages(response.total_pages);
    } catch {
      setError("Failed to load skills.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSkills();
  }, [page]);

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
        setSuccess("Skill updated successfully.");
      } else {
        await createSkill(form);
        setSuccess("Skill created successfully.");
      }

      setForm(emptyForm);
      setEditingId(null);

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
    setEditingId(skill.id);

    setForm({
      name: skill.name,
      category: skill.category,
      proficiency: skill.proficiency,
    });

    setError("");
    setSuccess("");
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

      setSuccess("Skill deleted successfully.");

      if (skills.length === 1 && page > 1) {
        setPage((current) => current - 1);
      } else {
        await loadSkills();
      }
    } catch {
      setError("Failed to delete skill.");
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
      <h1>Skills</h1>

      {error && <p>{error}</p>}
      {success && <p>{success}</p>}

      <section>
        <h2>{editingId ? "Edit Skill" : "Add Skill"}</h2>

        <form onSubmit={handleSubmit}>
          <div>
  <label htmlFor="skill-name">
    Name
  </label>

  <select
    id="skill-name"
    value={form.name}
    onChange={(event) =>
      handleChange("name", event.target.value)
    }
    required
  >
    <option value="" disabled>
      Select skill
    </option>

    {SKILL_NAMES.map((name) => (
      <option key={name} value={name}>
        {name}
      </option>
    ))}
  </select>
</div>

          <div>
  <label htmlFor="skill-category">
    Category
  </label>

  <select
    id="skill-category"
    value={form.category}
    onChange={(event) =>
      handleChange("category", event.target.value)
    }
    required
  >
    <option value="" disabled>
      Select category
    </option>

    {SKILL_CATEGORIES.map((category) => (
      <option key={category} value={category}>
        {category}
      </option>
    ))}
  </select>
</div>

      <div>
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

    {PROFICIENCY_OPTIONS.map((level) => (
      <option key={level} value={level}>
        {level}
      </option>
    ))}
  </select>
</div>

          <button type="submit" disabled={saving}>
            {saving
              ? "Saving..."
              : editingId
                ? "Update Skill"
                : "Add Skill"}
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
        <h2>Skill List</h2>

        {loading ? (
          <p>Loading skills...</p>
        ) : skills.length === 0 ? (
          <p>No skills found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Proficiency</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {skills.map((skill) => (
                <tr key={skill.id}>
                  <td>{skill.name}</td>
                  <td>{skill.category}</td>
                  <td>{skill.proficiency}%</td>

                  <td>
                    <button
                      type="button"
                      onClick={() => handleEdit(skill)}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(skill.id)
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

      {totalPages > 1 && (
        <div>
          <button
            type="button"
            disabled={page === 1}
            onClick={() =>
              setPage((current) => current - 1)
            }
          >
            Previous
          </button>

          <span>
            Page {page} of {totalPages}
          </span>

          <button
            type="button"
            disabled={page === totalPages}
            onClick={() =>
              setPage((current) => current + 1)
            }
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}