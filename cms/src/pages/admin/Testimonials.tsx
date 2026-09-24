import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import {
  createTestimonial,
  deleteTestimonial,
  getTestimonial,
  getTestimonials,
  updateTestimonial,
  type Testimonial,
} from "../../api/testimonials";

interface TestimonialForm {
  name: string;
  role: string;
  company: string;
  content: string;
}

const EMPTY_FORM: TestimonialForm = {
  name: "",
  role: "",
  company: "",
  content: "",
};

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(
    [],
  );

  const [form, setForm] =
    useState<TestimonialForm>(EMPTY_FORM);

  const [editingId, setEditingId] = useState<string | null>(
    null,
  );

  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadTestimonials = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getTestimonials();
      setTestimonials(data);
    } catch {
      setError("Failed to load testimonials.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTestimonials();
  }, []);

  const handleChange = (
    field: keyof TestimonialForm,
    value: string,
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleAdd = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError("");
    setSuccess("");
    setShowForm(true);
  };

  const handleEdit = async (id: string) => {
    setError("");
    setSuccess("");

    try {
      const testimonial = await getTestimonial(id);

      setForm({
        name: testimonial.name,
        role: testimonial.role,
        company: testimonial.company,
        content: testimonial.content,
      });

      setEditingId(id);
      setShowForm(true);
    } catch {
      setError("Failed to load testimonial.");
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      if (editingId) {
        await updateTestimonial(editingId, form);
        setSuccess("Testimonial updated successfully.");
      } else {
        await createTestimonial(form);
        setSuccess("Testimonial created successfully.");
      }

      setForm(EMPTY_FORM);
      setEditingId(null);
      setShowForm(false);

      await loadTestimonials();
    } catch {
      setError(
        editingId
          ? "Failed to update testimonial."
          : "Failed to create testimonial.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this testimonial?",
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      await deleteTestimonial(id);

      setSuccess("Testimonial deleted successfully.");
      await loadTestimonials();
    } catch {
      setError("Failed to delete testimonial.");
    }
  };

  return (
    <section>
      {!showForm ? (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <h1>Testimonials</h1>

            <button onClick={handleAdd}>
              + Add Testimonial
            </button>
          </div>

          {loading && <p>Loading testimonials...</p>}

          {error && <p>{error}</p>}
          {success && <p>{success}</p>}

          {!loading && testimonials.length === 0 && (
            <p>No testimonials found.</p>
          )}

          {!loading && testimonials.length > 0 && (
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "10px",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    Name
                  </th>

                  <th
                    style={{
                      textAlign: "left",
                      padding: "10px",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    Role
                  </th>

                  <th
                    style={{
                      textAlign: "left",
                      padding: "10px",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    Company
                  </th>

                  <th
                    style={{
                      textAlign: "left",
                      padding: "10px",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    Content
                  </th>

                  <th
                    style={{
                      textAlign: "left",
                      padding: "10px",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {testimonials.map((testimonial) => (
                  <tr key={testimonial.id}>
                    <td
                      style={{
                        padding: "10px",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      {testimonial.name}
                    </td>

                    <td
                      style={{
                        padding: "10px",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      {testimonial.role}
                    </td>

                    <td
                      style={{
                        padding: "10px",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      {testimonial.company}
                    </td>

                    <td
                      style={{
                        padding: "10px",
                        borderBottom: "1px solid #eee",
                        maxWidth: "400px",
                      }}
                    >
                      {testimonial.content}
                    </td>

                    <td
                      style={{
                        padding: "10px",
                        borderBottom: "1px solid #eee",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <button
                        onClick={() =>
                          handleEdit(testimonial.id)
                        }
                        style={{ marginRight: "8px" }}
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(testimonial.id)
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
        </>
      ) : (
        <>
          <h1>
            {editingId
              ? "Edit Testimonial"
              : "Add Testimonial"}
          </h1>

          {error && <p>{error}</p>}
          {success && <p>{success}</p>}

          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="testimonial-name">
                Name
              </label>

              <input
                id="testimonial-name"
                type="text"
                value={form.name}
                onChange={(event) =>
                  handleChange("name", event.target.value)
                }
                required
              />
            </div>

            <div>
              <label htmlFor="testimonial-role">
                Role
              </label>

              <input
                id="testimonial-role"
                type="text"
                value={form.role}
                onChange={(event) =>
                  handleChange("role", event.target.value)
                }
                required
              />
            </div>

            <div>
              <label htmlFor="testimonial-company">
                Company
              </label>

              <input
                id="testimonial-company"
                type="text"
                value={form.company}
                onChange={(event) =>
                  handleChange(
                    "company",
                    event.target.value,
                  )
                }
                required
              />
            </div>

            <div>
              <label htmlFor="testimonial-content">
                Testimonial
              </label>

              <textarea
                id="testimonial-content"
                value={form.content}
                onChange={(event) =>
                  handleChange(
                    "content",
                    event.target.value,
                  )
                }
                rows={6}
                required
              />
            </div>

            <div style={{ marginTop: "20px" }}>
              <button
                type="submit"
                disabled={saving}
                style={{ marginRight: "10px" }}
              >
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update Testimonial"
                    : "Add Testimonial"}
              </button>

              <button
                type="button"
                onClick={handleCancel}
                disabled={saving}
              >
                Cancel
              </button>
            </div>
          </form>
        </>
      )}
    </section>
  );
}