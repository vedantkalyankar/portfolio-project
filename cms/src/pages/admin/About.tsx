import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import {
  getAbout,
  updateAbout,
  type About as AboutType,
  type AboutUpdateRequest,
} from "../../api/about";

const EMPTY_FORM: AboutUpdateRequest = {
  name: "",
  title: "",
  bio: "",
  email: "",
  location: "",
  github_url: "",
  linkedin_url: "",
};

export default function About() {
  const [form, setForm] =
    useState<AboutUpdateRequest>(EMPTY_FORM);

  const [aboutId, setAboutId] = useState<string | null>(
    null,
  );

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadAbout = async () => {
      try {
        setLoading(true);
        setError("");

        const data: AboutType = await getAbout();

        setAboutId(data.id);

        setForm({
          name: data.name,
          title: data.title,
          bio: data.bio,
          email: data.email,
          location: data.location,
          github_url: data.github_url,
          linkedin_url: data.linkedin_url,
        });
      } catch {
        setError(
          "Failed to load About information.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadAbout();
  }, []);

  const handleChange = (
    field: keyof AboutUpdateRequest,
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

    if (!aboutId) {
      setError(
        "About information is not available.",
      );
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const updated = await updateAbout(form);

      setAboutId(updated.id);

      setForm({
        name: updated.name,
        title: updated.title,
        bio: updated.bio,
        email: updated.email,
        location: updated.location,
        github_url: updated.github_url,
        linkedin_url: updated.linkedin_url,
      });

      setSuccess(
        "About information updated successfully.",
      );
    } catch {
      setError(
        "Failed to update About information.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="crud-page">
        <div className="crud-state">
          <p>Loading About information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="crud-page">
      <section className="crud-header">
        <div>
          <p className="crud-eyebrow">
            PROFILE INFORMATION
          </p>

          <h1>About</h1>

          <p className="crud-description">
            Manage the personal and contact information
            displayed on your portfolio.
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
            <h2>Profile details</h2>

            <p>
              Update the information visitors see on your
              portfolio.
            </p>
          </div>
        </div>

        <form
          className="crud-form"
          onSubmit={handleSubmit}
        >
          <div className="crud-form-grid">
            <div className="crud-field">
              <label htmlFor="about-name">
                Name
              </label>

              <input
                id="about-name"
                type="text"
                value={form.name}
                onChange={(event) =>
                  handleChange(
                    "name",
                    event.target.value,
                  )
                }
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="crud-field">
              <label htmlFor="about-title">
                Professional title
              </label>

              <input
                id="about-title"
                type="text"
                value={form.title}
                onChange={(event) =>
                  handleChange(
                    "title",
                    event.target.value,
                  )
                }
                placeholder="e.g. Software Engineer"
                required
              />
            </div>

            <div className="crud-field">
              <label htmlFor="about-email">
                Email
              </label>

              <input
                id="about-email"
                type="email"
                value={form.email}
                onChange={(event) =>
                  handleChange(
                    "email",
                    event.target.value,
                  )
                }
                placeholder="Enter your email address"
                required
              />
            </div>

            <div className="crud-field">
              <label htmlFor="about-location">
                Location
              </label>

              <input
                id="about-location"
                type="text"
                value={form.location}
                onChange={(event) =>
                  handleChange(
                    "location",
                    event.target.value,
                  )
                }
                placeholder="e.g. India"
                required
              />
            </div>
          </div>

          <div className="crud-field">
            <label htmlFor="about-bio">
              Bio
            </label>

            <textarea
              id="about-bio"
              value={form.bio}
              onChange={(event) =>
                handleChange(
                  "bio",
                  event.target.value,
                )
              }
              rows={8}
              placeholder="Write a short professional introduction."
              required
            />

            <p className="crud-field-help">
              Keep this concise and focused on your
              professional background and technical focus.
            </p>
          </div>

          <div className="crud-form-grid">
            <div className="crud-field">
              <label htmlFor="about-github">
                GitHub URL
              </label>

              <input
                id="about-github"
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
              <label htmlFor="about-linkedin">
                LinkedIn URL
              </label>

              <input
                id="about-linkedin"
                type="url"
                value={form.linkedin_url}
                onChange={(event) =>
                  handleChange(
                    "linkedin_url",
                    event.target.value,
                  )
                }
                placeholder="https://www.linkedin.com/in/..."
                required
              />
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
                : "Save Changes"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}