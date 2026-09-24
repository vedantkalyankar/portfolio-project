import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import {
  createService,
  deleteService,
  getService,
  getServices,
  updateService,
  type Service,
} from "../../api/services";

interface ServiceForm {
  title: string;
  description: string;
  icon: string;
}

const EMPTY_FORM: ServiceForm = {
  title: "",
  description: "",
  icon: "",
};

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);

  const [form, setForm] =
    useState<ServiceForm>(EMPTY_FORM);

  const [editingId, setEditingId] = useState<string | null>(
    null,
  );

  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadServices = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getServices();

      setServices(data);
    } catch {
      setError("Failed to load services.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleChange = (
    field: keyof ServiceForm,
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
      const service = await getService(id);

      setForm({
        title: service.title,
        description: service.description,
        icon: service.icon,
      });

      setEditingId(service.id);
      setShowForm(true);
    } catch {
      setError("Failed to load service.");
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
        await updateService(editingId, form);

        setSuccess(
          "Service updated successfully.",
        );
      } else {
        await createService(form);

        setSuccess(
          "Service created successfully.",
        );
      }

      setForm(EMPTY_FORM);
      setEditingId(null);
      setShowForm(false);

      await loadServices();
    } catch {
      setError(
        editingId
          ? "Failed to update service."
          : "Failed to create service.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this service?",
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      await deleteService(id);

      setSuccess(
        "Service deleted successfully.",
      );

      await loadServices();
    } catch {
      setError("Failed to delete service.");
    }
  };

  return (
    <div className="crud-page">
      {!showForm ? (
        <>
          <section className="crud-header">
            <div>
              <p className="crud-eyebrow">
                WHAT I OFFER
              </p>

              <h1>Services</h1>

              <p className="crud-description">
                Manage the services displayed on your
                portfolio.
              </p>
            </div>

            <div className="crud-header-action">
              <button
                type="button"
                className="crud-button crud-button-primary"
                onClick={openAddForm}
              >
                + Add Service
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
                <h2>Service list</h2>

                <p>
                  View and manage the services available
                  on your portfolio.
                </p>
              </div>

              <div className="crud-section-count">
                {services.length}{" "}
                {services.length === 1
                  ? "service"
                  : "services"}
              </div>
            </div>

            {loading ? (
              <div className="crud-state">
                <p>Loading services...</p>
              </div>
            ) : services.length === 0 ? (
              <div className="crud-state">
                <h3>No services yet</h3>

                <p>
                  Add your first service using the button
                  above.
                </p>
              </div>
            ) : (
              <div className="crud-table-wrapper">
                <table className="crud-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Description</th>
                      <th>Icon</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {services.map((service) => (
                      <tr key={service.id}>
                        <td>
                          <div className="crud-project-title">
                            {service.title}
                          </div>
                        </td>

                        <td>
                          <div className="crud-project-description">
                            {service.description}
                          </div>
                        </td>

                        <td>
                          <span className="crud-skill-proficiency">
                            {service.icon}
                          </span>
                        </td>

                        <td>
                          <div className="crud-row-actions">
                            <button
                              type="button"
                              className="crud-button crud-button-small"
                              onClick={() =>
                                handleEdit(service.id)
                              }
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              className="crud-button crud-button-small crud-button-danger"
                              onClick={() =>
                                handleDelete(service.id)
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
        </>
      ) : (
        <>
          <section className="crud-header">
            <div>
              <p className="crud-eyebrow">
                WHAT I OFFER
              </p>

              <h1>
                {editingId
                  ? "Edit Service"
                  : "Add Service"}
              </h1>

              <p className="crud-description">
                {editingId
                  ? "Update the service information below."
                  : "Add a new service to your portfolio."}
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
                <h2>Service details</h2>

                <p>
                  Enter the information for the service
                  displayed on your portfolio.
                </p>
              </div>
            </div>

            <form
              className="crud-form"
              onSubmit={handleSubmit}
            >
              <div className="crud-form-grid">
                <div className="crud-field">
                  <label htmlFor="service-title">
                    Title
                  </label>

                  <input
                    id="service-title"
                    type="text"
                    value={form.title}
                    onChange={(event) =>
                      handleChange(
                        "title",
                        event.target.value,
                      )
                    }
                    placeholder="Enter service title"
                    required
                  />
                </div>

                <div className="crud-field">
                  <label htmlFor="service-icon">
                    Icon
                  </label>

                  <input
                    id="service-icon"
                    type="text"
                    value={form.icon}
                    onChange={(event) =>
                      handleChange(
                        "icon",
                        event.target.value,
                      )
                    }
                    placeholder="e.g. code"
                    required
                  />

                  <p className="crud-field-help">
                    Enter the icon identifier used by your
                    portfolio frontend.
                  </p>
                </div>
              </div>

              <div className="crud-field">
                <label htmlFor="service-description">
                  Description
                </label>

                <textarea
                  id="service-description"
                  value={form.description}
                  onChange={(event) =>
                    handleChange(
                      "description",
                      event.target.value,
                    )
                  }
                  rows={8}
                  placeholder="Describe the service you provide."
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
                      ? "Update Service"
                      : "Add Service"}
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