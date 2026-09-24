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
  const [testimonials, setTestimonials] = useState<
    Testimonial[]
  >([]);

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
    try {
      setLoading(true);
      setError("");

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

      setEditingId(testimonial.id);
      setShowForm(true);
    } catch {
      setError("Failed to load testimonial.");
    }
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
        await updateTestimonial(editingId, form);

        setSuccess(
          "Testimonial updated successfully.",
        );
      } else {
        await createTestimonial(form);

        setSuccess(
          "Testimonial created successfully.",
        );
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

      setSuccess(
        "Testimonial deleted successfully.",
      );

      await loadTestimonials();
    } catch {
      setError("Failed to delete testimonial.");
    }
  };

  return (
    <div className="crud-page">
      {!showForm ? (
        <>
          <section className="crud-header">
            <div>
              <p className="crud-eyebrow">
                SOCIAL PROOF
              </p>

              <h1>Testimonials</h1>

              <p className="crud-description">
                Manage the testimonials displayed on your
                portfolio.
              </p>
            </div>

            <div className="crud-header-action">
              <button
                type="button"
                className="crud-button crud-button-primary"
                onClick={openAddForm}
              >
                + Add Testimonial
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
                <h2>Testimonial list</h2>

                <p>
                  View and manage feedback from clients,
                  colleagues, and collaborators.
                </p>
              </div>

              <div className="crud-section-count">
                {testimonials.length}{" "}
                {testimonials.length === 1
                  ? "testimonial"
                  : "testimonials"}
              </div>
            </div>

            {loading ? (
              <div className="crud-state">
                <p>Loading testimonials...</p>
              </div>
            ) : testimonials.length === 0 ? (
              <div className="crud-state">
                <h3>No testimonials yet</h3>

                <p>
                  Add your first testimonial using the
                  button above.
                </p>
              </div>
            ) : (
              <div className="crud-table-wrapper">
                <table className="crud-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Role</th>
                      <th>Company</th>
                      <th>Testimonial</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {testimonials.map(
                      (testimonial) => (
                        <tr key={testimonial.id}>
                          <td>
                            <div className="crud-project-title">
                              {testimonial.name}
                            </div>
                          </td>

                          <td>
                            <span className="crud-experience-role">
                              {testimonial.role}
                            </span>
                          </td>

                          <td>
                            <span className="crud-skill-category">
                              {testimonial.company}
                            </span>
                          </td>

                          <td>
                            <div className="crud-project-description">
                              {testimonial.content}
                            </div>
                          </td>

                          <td>
                            <div className="crud-row-actions">
                              <button
                                type="button"
                                className="crud-button crud-button-small"
                                onClick={() =>
                                  handleEdit(
                                    testimonial.id,
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
                                    testimonial.id,
                                  )
                                }
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      ) : (
        <>
          <section className="crud-header">
            <div>
              <p className="crud-eyebrow">
                SOCIAL PROOF
              </p>

              <h1>
                {editingId
                  ? "Edit Testimonial"
                  : "Add Testimonial"}
              </h1>

              <p className="crud-description">
                {editingId
                  ? "Update the testimonial information below."
                  : "Add a new testimonial to your portfolio."}
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
                <h2>Testimonial details</h2>

                <p>
                  Enter the details of the person and
                  their feedback.
                </p>
              </div>
            </div>

            <form
              className="crud-form"
              onSubmit={handleSubmit}
            >
              <div className="crud-form-grid">
                <div className="crud-field">
                  <label htmlFor="testimonial-name">
                    Name
                  </label>

                  <input
                    id="testimonial-name"
                    type="text"
                    value={form.name}
                    onChange={(event) =>
                      handleChange(
                        "name",
                        event.target.value,
                      )
                    }
                    placeholder="Enter person's name"
                    required
                  />
                </div>

                <div className="crud-field">
                  <label htmlFor="testimonial-role">
                    Role
                  </label>

                  <input
                    id="testimonial-role"
                    type="text"
                    value={form.role}
                    onChange={(event) =>
                      handleChange(
                        "role",
                        event.target.value,
                      )
                    }
                    placeholder="Enter person's role"
                    required
                  />
                </div>

                <div className="crud-field">
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
                    placeholder="Enter company name"
                    required
                  />
                </div>
              </div>

              <div className="crud-field">
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
                  rows={8}
                  placeholder="Enter the testimonial content."
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
                      ? "Update Testimonial"
                      : "Add Testimonial"}
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