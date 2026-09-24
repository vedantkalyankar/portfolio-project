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
    setLoading(true);
    setError("");

    try {
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
      const service = await getService(id);

      setForm({
        title: service.title,
        description: service.description,
        icon: service.icon,
      });

      setEditingId(id);
      setShowForm(true);
    } catch {
      setError("Failed to load service.");
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
        await updateService(editingId, form);
        setSuccess("Service updated successfully.");
      } else {
        await createService(form);
        setSuccess("Service created successfully.");
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

      setSuccess("Service deleted successfully.");
      await loadServices();
    } catch {
      setError("Failed to delete service.");
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
            <h1>Services</h1>

            <button onClick={handleAdd}>
              + Add Service
            </button>
          </div>

          {loading && <p>Loading services...</p>}

          {error && <p>{error}</p>}
          {success && <p>{success}</p>}

          {!loading && services.length === 0 && (
            <p>No services found.</p>
          )}

          {!loading && services.length > 0 && (
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
                    Title
                  </th>

                  <th
                    style={{
                      textAlign: "left",
                      padding: "10px",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    Description
                  </th>

                  <th
                    style={{
                      textAlign: "left",
                      padding: "10px",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    Icon
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
                {services.map((service) => (
                  <tr key={service.id}>
                    <td
                      style={{
                        padding: "10px",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      {service.title}
                    </td>

                    <td
                      style={{
                        padding: "10px",
                        borderBottom: "1px solid #eee",
                        maxWidth: "450px",
                      }}
                    >
                      {service.description}
                    </td>

                    <td
                      style={{
                        padding: "10px",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      {service.icon}
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
                          handleEdit(service.id)
                        }
                        style={{ marginRight: "8px" }}
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(service.id)
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
              ? "Edit Service"
              : "Add Service"}
          </h1>

          {error && <p>{error}</p>}

          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="service-title">
                Title
              </label>

              <input
                id="service-title"
                type="text"
                value={form.title}
                onChange={(event) =>
                  handleChange("title", event.target.value)
                }
                required
              />
            </div>

            <div>
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
                rows={6}
                required
              />
            </div>

            <div>
              <label htmlFor="service-icon">
                Icon
              </label>

              <input
                id="service-icon"
                type="text"
                value={form.icon}
                onChange={(event) =>
                  handleChange("icon", event.target.value)
                }
                placeholder="e.g. code"
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
                    ? "Update Service"
                    : "Add Service"}
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