import { useEffect, useState, type FormEvent } from "react";

import {
  getAbout,
  updateAbout,
  type About as AboutType,
  type AboutUpdateRequest,
} from "../../api/about";

const emptyForm: AboutUpdateRequest = {
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
    useState<AboutUpdateRequest>(emptyForm);

  const [aboutId, setAboutId] = useState<string | null>(null);
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
        setError("Failed to load About information.");
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
      setError("About information is not available.");
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

      setSuccess("About information updated successfully.");
    } catch {
      setError("Failed to update About information.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p>Loading About information...</p>;
  }

  return (
    <div>
      <h1>About</h1>

      {error && <p>{error}</p>}

      {success && <p>{success}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            value={form.name}
            onChange={(event) =>
              handleChange("name", event.target.value)
            }
            required
          />
        </div>

        <div>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            value={form.title}
            onChange={(event) =>
              handleChange("title", event.target.value)
            }
            required
          />
        </div>

        <div>
          <label htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            value={form.bio}
            onChange={(event) =>
              handleChange("bio", event.target.value)
            }
            rows={6}
            required
          />
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={form.email}
            onChange={(event) =>
              handleChange("email", event.target.value)
            }
            required
          />
        </div>

        <div>
          <label htmlFor="location">Location</label>
          <input
            id="location"
            type="text"
            value={form.location}
            onChange={(event) =>
              handleChange("location", event.target.value)
            }
            required
          />
        </div>

        <div>
          <label htmlFor="github_url">GitHub URL</label>
          <input
            id="github_url"
            type="url"
            value={form.github_url}
            onChange={(event) =>
              handleChange("github_url", event.target.value)
            }
            required
          />
        </div>

        <div>
          <label htmlFor="linkedin_url">LinkedIn URL</label>
          <input
            id="linkedin_url"
            type="url"
            value={form.linkedin_url}
            onChange={(event) =>
              handleChange("linkedin_url", event.target.value)
            }
            required
          />
        </div>

        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}