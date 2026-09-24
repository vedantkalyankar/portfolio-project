import { useEffect, useState, type FormEvent } from "react";

import {
  createExperience,
  deleteExperience,
  getExperience,
  getExperiences,
  updateExperience,
  type Experience as ExperienceType,
} from "../../api/experiences";

interface ExperienceForm {
  company: string;
  role: string;
  location: string;
  description: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
}

const getToday = (): string => {
  return new Date().toISOString().split("T")[0];
};

const EMPTY_FORM: ExperienceForm = {
  company: "",
  role: "",
  location: "",
  description: "",
  start_date: "",
  end_date: getToday(),
  is_current: false,
};

const ROLE_OPTIONS = [
  "Intern",
  "Trainee",
  "Apprentice",
  "Graduate Software Engineer",
  "Associate Software Engineer",
  "Junior Software Engineer",
  "Junior Developer",
  "Junior Software Developer",

  "Software Engineer",
  "Software Developer",
  "Web Developer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Application Developer",
  "System Developer",
  "API Developer",
  "Python Developer",
  "Java Developer",
  "React Developer",
  "Django Developer",
  "FastAPI Developer",

  "QA Engineer",
  "Software Test Engineer",
  "Test Engineer",
  "Automation Test Engineer",
  "QA Automation Engineer",
  "SDET",
  "Senior SDET",

  "Data Analyst",
  "Data Engineer",
  "Junior Data Scientist",
  "Data Scientist",
  "Machine Learning Engineer",
  "AI Engineer",
  "Generative AI Engineer",
  "ML Engineer",

  "Software Engineer II",
  "Software Developer II",
  "Application Engineer",
  "Systems Engineer",
  "Senior Software Engineer",
  "Senior Software Developer",
  "Senior Backend Engineer",
  "Senior Frontend Engineer",
  "Senior Full Stack Engineer",
  "Senior Application Engineer",
  "Senior QA Engineer",
  "Senior Automation Engineer",
  "Senior Data Engineer",
  "Senior Data Scientist",
  "Senior Machine Learning Engineer",
  "Senior AI Engineer",

  "Technical Lead",
  "Team Lead",
  "Software Development Lead",
  "Senior Technical Lead",
  "Lead Software Engineer",
  "Lead Software Developer",
  "Lead Backend Engineer",
  "Lead Frontend Engineer",
  "Lead Full Stack Engineer",
  "Lead QA Engineer",
  "Lead Automation Engineer",
  "Lead Data Engineer",
  "Lead Data Scientist",
  "Lead Machine Learning Engineer",
  "Lead AI Engineer",

  "Solution Architect",
  "Software Architect",
  "Application Architect",
  "Cloud Architect",
  "Data Architect",
  "AI Architect",
  "Enterprise Architect",
  "Technical Architect",
  "Principal Engineer",
  "Principal Software Engineer",
  "Principal Developer",

  "Engineering Manager",
  "Software Engineering Manager",
  "Development Manager",
  "QA Manager",
  "Project Manager",
  "Technical Program Manager",
  "Senior Engineering Manager",
  "Senior Development Manager",
  "Director of Engineering",
  "Director of Software Engineering",
  "Head of Engineering",
  "Head of Software Development",
  "Vice President of Engineering",
  "Chief Technology Officer",
];

const LOCATION_OPTIONS = [
  "Ahmedabad, India",
  "Bengaluru, India",
  "Bhopal, India",
  "Bhubaneswar, India",
  "Chandigarh, India",
  "Chennai, India",
  "Coimbatore, India",
  "Delhi, India",
  "Gurugram, India",
  "Hyderabad, India",
  "Indore, India",
  "Jaipur, India",
  "Kochi, India",
  "Kolkata, India",
  "Lucknow, India",
  "Mumbai, India",
  "Nagpur, India",
  "Noida, India",
  "Pune, India",
  "Surat, India",
  "Thiruvananthapuram, India",
  "Vadodara, India",
  "Visakhapatnam, India",

  "Austin, United States",
  "Boston, United States",
  "Chicago, United States",
  "Dallas, United States",
  "Denver, United States",
  "Houston, United States",
  "Los Angeles, United States",
  "Miami, United States",
  "New York, United States",
  "Philadelphia, United States",
  "Phoenix, United States",
  "San Diego, United States",
  "San Francisco, United States",
  "San Jose, United States",
  "Seattle, United States",
  "Washington, United States",

  "Calgary, Canada",
  "Edmonton, Canada",
  "Montreal, Canada",
  "Ottawa, Canada",
  "Toronto, Canada",
  "Vancouver, Canada",
  "Winnipeg, Canada",

  "Birmingham, United Kingdom",
  "Bristol, United Kingdom",
  "Cambridge, United Kingdom",
  "Edinburgh, United Kingdom",
  "Glasgow, United Kingdom",
  "Leeds, United Kingdom",
  "Liverpool, United Kingdom",
  "London, United Kingdom",
  "Manchester, United Kingdom",
  "Oxford, United Kingdom",

  "Cork, Ireland",
  "Dublin, Ireland",
  "Galway, Ireland",
  "Limerick, Ireland",

  "Berlin, Germany",
  "Cologne, Germany",
  "Dresden, Germany",
  "Frankfurt, Germany",
  "Hamburg, Germany",
  "Munich, Germany",
  "Stuttgart, Germany",

  "Bordeaux, France",
  "Lille, France",
  "Lyon, France",
  "Marseille, France",
  "Nantes, France",
  "Nice, France",
  "Paris, France",
  "Toulouse, France",

  "Amsterdam, Netherlands",
  "Eindhoven, Netherlands",
  "Rotterdam, Netherlands",
  "The Hague, Netherlands",
  "Utrecht, Netherlands",

  "Basel, Switzerland",
  "Bern, Switzerland",
  "Geneva, Switzerland",
  "Lausanne, Switzerland",
  "Zurich, Switzerland",

  "Barcelona, Spain",
  "Bilbao, Spain",
  "Madrid, Spain",
  "Malaga, Spain",
  "Seville, Spain",
  "Valencia, Spain",

  "Bologna, Italy",
  "Florence, Italy",
  "Milan, Italy",
  "Naples, Italy",
  "Rome, Italy",
  "Turin, Italy",

  "Lisbon, Portugal",
  "Porto, Portugal",

  "Gothenburg, Sweden",
  "Malmo, Sweden",
  "Stockholm, Sweden",

  "Bergen, Norway",
  "Oslo, Norway",
  "Trondheim, Norway",

  "Aarhus, Denmark",
  "Copenhagen, Denmark",

  "Espoo, Finland",
  "Helsinki, Finland",
  "Tampere, Finland",

  "Krakow, Poland",
  "Poznan, Poland",
  "Warsaw, Poland",
  "Wroclaw, Poland",

  "Brno, Czech Republic",
  "Prague, Czech Republic",

  "Graz, Austria",
  "Vienna, Austria",

  "Antwerp, Belgium",
  "Brussels, Belgium",
  "Ghent, Belgium",

  "Bucharest, Romania",
  "Cluj-Napoca, Romania",
  "Timisoara, Romania",

  "Budapest, Hungary",

  "Athens, Greece",
  "Thessaloniki, Greece",

  "Moscow, Russia",
  "Novosibirsk, Russia",
  "Saint Petersburg, Russia",

  "Kyiv, Ukraine",
  "Lviv, Ukraine",

  "Abu Dhabi, United Arab Emirates",
  "Dubai, United Arab Emirates",
  "Sharjah, United Arab Emirates",

  "Jeddah, Saudi Arabia",
  "Riyadh, Saudi Arabia",

  "Doha, Qatar",

  "Haifa, Israel",
  "Jerusalem, Israel",
  "Tel Aviv, Israel",

  "Singapore, Singapore",

  "Fukuoka, Japan",
  "Nagoya, Japan",
  "Osaka, Japan",
  "Tokyo, Japan",
  "Yokohama, Japan",

  "Busan, South Korea",
  "Seoul, South Korea",

  "Beijing, China",
  "Chengdu, China",
  "Guangzhou, China",
  "Hangzhou, China",
  "Shanghai, China",
  "Shenzhen, China",

  "Hong Kong, Hong Kong",

  "Kaohsiung, Taiwan",
  "Taipei, Taiwan",

  "Adelaide, Australia",
  "Brisbane, Australia",
  "Canberra, Australia",
  "Melbourne, Australia",
  "Perth, Australia",
  "Sydney, Australia",

  "Auckland, New Zealand",
  "Christchurch, New Zealand",
  "Wellington, New Zealand",

  "Cape Town, South Africa",
  "Durban, South Africa",
  "Johannesburg, South Africa",
  "Pretoria, South Africa",

  "Belo Horizonte, Brazil",
  "Brasilia, Brazil",
  "Curitiba, Brazil",
  "Rio de Janeiro, Brazil",
  "Sao Paulo, Brazil",

  "Guadalajara, Mexico",
  "Mexico City, Mexico",
  "Monterrey, Mexico",

  "Buenos Aires, Argentina",
  "Cordoba, Argentina",
  "Rosario, Argentina",

  "Santiago, Chile",

  "Bogota, Colombia",
  "Medellin, Colombia",

  "Alexandria, Egypt",
  "Cairo, Egypt",

  "Nairobi, Kenya",

  "Abuja, Nigeria",
  "Lagos, Nigeria",

  "Ankara, Turkey",
  "Istanbul, Turkey",

  "Kuala Lumpur, Malaysia",
  "Penang, Malaysia",

  "Bangkok, Thailand",

  "Jakarta, Indonesia",

  "Manila, Philippines",

  "Hanoi, Vietnam",
  "Ho Chi Minh City, Vietnam",

  "Islamabad, Pakistan",
  "Karachi, Pakistan",
  "Lahore, Pakistan",

  "Dhaka, Bangladesh",

  "Colombo, Sri Lanka",

  "Kathmandu, Nepal",
];

export default function Experience() {
  const [experiences, setExperiences] = useState<
    ExperienceType[]
  >([]);

  const [form, setForm] =
    useState<ExperienceForm>(EMPTY_FORM);

  const [editingId, setEditingId] = useState<string | null>(
    null,
  );

  const [showForm, setShowForm] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadExperiences = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getExperiences();
      setExperiences(data);
    } catch {
      setError("Failed to load experiences.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExperiences();
  }, []);

  const handleChange = (
    field: keyof ExperienceForm,
    value: string | boolean,
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setSuccess("");
  };

  const openAddForm = () => {
    setForm({
      ...EMPTY_FORM,
      end_date: getToday(),
      is_current: false,
    });

    setEditingId(null);
    setError("");
    setSuccess("");
    setShowForm(true);
  };

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(false);
  };

  const handleCurrentlyWorkingChange = (
    isCurrent: boolean,
  ) => {
    setForm((current) => ({
      ...current,
      is_current: isCurrent,
      end_date: isCurrent
        ? getToday()
        : current.end_date || getToday(),
    }));
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    const payload = {
      company: form.company,
      role: form.role,
      location: form.location,
      description: form.description,
      start_date: form.start_date,
      end_date: form.is_current
        ? getToday()
        : form.end_date,
      is_current: form.is_current,
    };

    try {
      if (editingId) {
        await updateExperience(editingId, payload);

        setSuccess(
          "Experience updated successfully.",
        );
      } else {
        await createExperience(payload);

        setSuccess(
          "Experience created successfully.",
        );
      }

      resetForm();
      await loadExperiences();
    } catch {
      setError(
        editingId
          ? "Failed to update experience."
          : "Failed to create experience.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (id: string) => {
    setError("");
    setSuccess("");

    try {
      const experience = await getExperience(id);

      setForm({
        company: experience.company,
        role: experience.role,
        location: experience.location,
        description: experience.description,
        start_date: experience.start_date,
        end_date:
          experience.end_date || getToday(),
        is_current: experience.is_current,
      });

      setEditingId(experience.id);
      setShowForm(true);
    } catch {
      setError("Failed to load experience.");
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this experience?",
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      await deleteExperience(id);

      if (editingId === id) {
        resetForm();
      }

      setSuccess(
        "Experience deleted successfully.",
      );

      await loadExperiences();
    } catch {
      setError("Failed to delete experience.");
    }
  };

  return (
    <div className="crud-page">
      {!showForm ? (
        <>
          <section className="crud-header">
            <div>
              <p className="crud-eyebrow">
                CAREER HISTORY
              </p>

              <h1>Experience</h1>

              <p className="crud-description">
                Manage your professional experience and
                career history.
              </p>
            </div>

            <div className="crud-header-action">
              <button
                type="button"
                className="crud-button crud-button-primary"
                onClick={openAddForm}
              >
                + Add Experience
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
                <h2>Experience list</h2>

                <p>
                  View and manage your professional
                  experience.
                </p>
              </div>

              <div className="crud-section-count">
                {experiences.length}{" "}
                {experiences.length === 1
                  ? "position"
                  : "positions"}
              </div>
            </div>

            {loading ? (
              <div className="crud-state">
                <p>Loading experiences...</p>
              </div>
            ) : experiences.length === 0 ? (
              <div className="crud-state">
                <h3>No experience yet</h3>

                <p>
                  Add your first professional position
                  using the button above.
                </p>
              </div>
            ) : (
              <div className="crud-table-wrapper">
                <table className="crud-table">
                  <thead>
                    <tr>
                      <th>Company</th>
                      <th>Role</th>
                      <th>Location</th>
                      <th>Period</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {experiences.map((experience) => (
                      <tr key={experience.id}>
                        <td>
                          <div className="crud-project-title">
                            {experience.company}
                          </div>
                        </td>

                        <td>
                          <span className="crud-experience-role">
                            {experience.role}
                          </span>
                        </td>

                        <td>
                          <span className="crud-skill-category">
                            {experience.location}
                          </span>
                        </td>

                        <td>
                          <div className="crud-experience-period">
                            <span>
                              {experience.start_date}
                            </span>

                            <span>→</span>

                            <span>
                              {experience.is_current
                                ? "Present"
                                : experience.end_date}
                            </span>
                          </div>
                        </td>

                        <td>
                          <span
                            className={`crud-status-badge ${
                              experience.is_current
                                ? "crud-status-published"
                                : "crud-status-draft"
                            }`}
                          >
                            {experience.is_current
                              ? "Current"
                              : "Past"}
                          </span>
                        </td>

                        <td>
                          <div className="crud-row-actions">
                            <button
                              type="button"
                              className="crud-button crud-button-small"
                              onClick={() =>
                                handleEdit(
                                  experience.id,
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
                                  experience.id,
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
        </>
      ) : (
        <>
          <section className="crud-header">
            <div>
              <p className="crud-eyebrow">
                CAREER HISTORY
              </p>

              <h1>
                {editingId
                  ? "Edit Experience"
                  : "Add Experience"}
              </h1>

              <p className="crud-description">
                {editingId
                  ? "Update the professional experience details below."
                  : "Add a new professional position to your portfolio."}
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
                <h2>Experience details</h2>

                <p>
                  Enter the details of your professional
                  position.
                </p>
              </div>
            </div>

            <form
              className="crud-form"
              onSubmit={handleSubmit}
            >
              <div className="crud-form-grid">
                <div className="crud-field">
                  <label htmlFor="experience-company">
                    Company
                  </label>

                  <input
                    id="experience-company"
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

                <div className="crud-field">
                  <label htmlFor="experience-role">
                    Role
                  </label>

                  <select
                    id="experience-role"
                    value={form.role}
                    onChange={(event) =>
                      handleChange(
                        "role",
                        event.target.value,
                      )
                    }
                    required
                  >
                    <option value="" disabled>
                      Select role
                    </option>

                    {ROLE_OPTIONS.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="crud-field">
                  <label htmlFor="experience-location">
                    Location
                  </label>

                  <select
                    id="experience-location"
                    value={form.location}
                    onChange={(event) =>
                      handleChange(
                        "location",
                        event.target.value,
                      )
                    }
                    required
                  >
                    <option value="" disabled>
                      Select location
                    </option>

                    {LOCATION_OPTIONS.map(
                      (location) => (
                        <option
                          key={location}
                          value={location}
                        >
                          {location}
                        </option>
                      ),
                    )}
                  </select>
                </div>

                <div className="crud-field">
                  <label htmlFor="experience-start-date">
                    Start Date
                  </label>

                  <input
                    id="experience-start-date"
                    type="date"
                    value={form.start_date}
                    onChange={(event) =>
                      handleChange(
                        "start_date",
                        event.target.value,
                      )
                    }
                    required
                  />
                </div>

                <div className="crud-field">
                  <label htmlFor="experience-end-date">
                    End Date
                  </label>

                  <input
                    id="experience-end-date"
                    type="date"
                    value={form.end_date}
                    onChange={(event) =>
                      handleChange(
                        "end_date",
                        event.target.value,
                      )
                    }
                    disabled={form.is_current}
                    required={!form.is_current}
                  />
                </div>
              </div>

              <div className="crud-field">
                <label htmlFor="experience-description">
                  Responsibilities
                </label>

                <textarea
                  id="experience-description"
                  rows={8}
                  value={form.description}
                  onChange={(event) =>
                    handleChange(
                      "description",
                      event.target.value,
                    )
                  }
                  placeholder="Describe your responsibilities, achievements, technologies used, and contributions."
                  required
                />
              </div>

              <fieldset className="crud-radio-field">
                <legend>Currently working</legend>

                <div className="crud-radio-group">
                  <label className="crud-radio-option">
                    <input
                      type="radio"
                      name="currently-working"
                      checked={!form.is_current}
                      onChange={() =>
                        handleCurrentlyWorkingChange(
                          false,
                        )
                      }
                    />

                    <span>No</span>
                  </label>

                  <label className="crud-radio-option">
                    <input
                      type="radio"
                      name="currently-working"
                      checked={form.is_current}
                      onChange={() =>
                        handleCurrentlyWorkingChange(
                          true,
                        )
                      }
                    />

                    <span>Yes</span>
                  </label>
                </div>

                {form.is_current && (
                  <p className="crud-field-help">
                    End date is automatically set to
                    today while this position is current.
                  </p>
                )}
              </fieldset>

              <div className="crud-form-actions">
                <button
                  type="submit"
                  className="crud-button crud-button-primary"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Update Experience"
                      : "Add Experience"}
                </button>

                <button
                  type="button"
                  className="crud-button crud-button-secondary"
                  onClick={resetForm}
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