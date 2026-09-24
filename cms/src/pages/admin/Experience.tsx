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
  // Entry Level
  "Intern",
  "Trainee",
  "Apprentice",
  "Graduate Software Engineer",
  "Associate Software Engineer",
  "Junior Software Engineer",
  "Junior Developer",
  "Junior Software Developer",

  // Development
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

  // QA / Testing
  "QA Engineer",
  "Software Test Engineer",
  "Test Engineer",
  "Automation Test Engineer",
  "QA Automation Engineer",
  "SDET",
  "Senior SDET",

  // Data / AI
  "Data Analyst",
  "Data Engineer",
  "Junior Data Scientist",
  "Data Scientist",
  "Machine Learning Engineer",
  "AI Engineer",
  "Generative AI Engineer",
  "ML Engineer",

  // Mid Level
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

  // Lead
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

  // Architecture
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

  // Management
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
  // India
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

  // United States
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

  // Canada
  "Calgary, Canada",
  "Edmonton, Canada",
  "Montreal, Canada",
  "Ottawa, Canada",
  "Toronto, Canada",
  "Vancouver, Canada",
  "Winnipeg, Canada",

  // United Kingdom
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

  // Ireland
  "Cork, Ireland",
  "Dublin, Ireland",
  "Galway, Ireland",
  "Limerick, Ireland",

  // Germany
  "Berlin, Germany",
  "Cologne, Germany",
  "Dresden, Germany",
  "Frankfurt, Germany",
  "Hamburg, Germany",
  "Munich, Germany",
  "Stuttgart, Germany",

  // France
  "Bordeaux, France",
  "Lille, France",
  "Lyon, France",
  "Marseille, France",
  "Nantes, France",
  "Nice, France",
  "Paris, France",
  "Toulouse, France",

  // Netherlands
  "Amsterdam, Netherlands",
  "Eindhoven, Netherlands",
  "Rotterdam, Netherlands",
  "The Hague, Netherlands",
  "Utrecht, Netherlands",

  // Switzerland
  "Basel, Switzerland",
  "Bern, Switzerland",
  "Geneva, Switzerland",
  "Lausanne, Switzerland",
  "Zurich, Switzerland",

  // Spain
  "Barcelona, Spain",
  "Bilbao, Spain",
  "Madrid, Spain",
  "Malaga, Spain",
  "Seville, Spain",
  "Valencia, Spain",

  // Italy
  "Bologna, Italy",
  "Florence, Italy",
  "Milan, Italy",
  "Naples, Italy",
  "Rome, Italy",
  "Turin, Italy",

  // Portugal
  "Lisbon, Portugal",
  "Porto, Portugal",

  // Sweden
  "Gothenburg, Sweden",
  "Malmo, Sweden",
  "Stockholm, Sweden",

  // Norway
  "Bergen, Norway",
  "Oslo, Norway",
  "Trondheim, Norway",

  // Denmark
  "Aarhus, Denmark",
  "Copenhagen, Denmark",

  // Finland
  "Espoo, Finland",
  "Helsinki, Finland",
  "Tampere, Finland",

  // Poland
  "Krakow, Poland",
  "Poznan, Poland",
  "Warsaw, Poland",
  "Wroclaw, Poland",

  // Czech Republic
  "Brno, Czech Republic",
  "Prague, Czech Republic",

  // Austria
  "Graz, Austria",
  "Vienna, Austria",

  // Belgium
  "Antwerp, Belgium",
  "Brussels, Belgium",
  "Ghent, Belgium",

  // Romania
  "Bucharest, Romania",
  "Cluj-Napoca, Romania",
  "Timisoara, Romania",

  // Hungary
  "Budapest, Hungary",

  // Greece
  "Athens, Greece",
  "Thessaloniki, Greece",

  // Russia
  "Moscow, Russia",
  "Novosibirsk, Russia",
  "Saint Petersburg, Russia",

  // Ukraine
  "Kyiv, Ukraine",
  "Lviv, Ukraine",

  // UAE
  "Abu Dhabi, United Arab Emirates",
  "Dubai, United Arab Emirates",
  "Sharjah, United Arab Emirates",

  // Saudi Arabia
  "Jeddah, Saudi Arabia",
  "Riyadh, Saudi Arabia",

  // Qatar
  "Doha, Qatar",

  // Israel
  "Haifa, Israel",
  "Jerusalem, Israel",
  "Tel Aviv, Israel",

  // Singapore
  "Singapore, Singapore",

  // Japan
  "Fukuoka, Japan",
  "Nagoya, Japan",
  "Osaka, Japan",
  "Tokyo, Japan",
  "Yokohama, Japan",

  // South Korea
  "Busan, South Korea",
  "Seoul, South Korea",

  // China
  "Beijing, China",
  "Chengdu, China",
  "Guangzhou, China",
  "Hangzhou, China",
  "Shanghai, China",
  "Shenzhen, China",

  // Hong Kong
  "Hong Kong, Hong Kong",

  // Taiwan
  "Kaohsiung, Taiwan",
  "Taipei, Taiwan",

  // Australia
  "Adelaide, Australia",
  "Brisbane, Australia",
  "Canberra, Australia",
  "Melbourne, Australia",
  "Perth, Australia",
  "Sydney, Australia",

  // New Zealand
  "Auckland, New Zealand",
  "Christchurch, New Zealand",
  "Wellington, New Zealand",

  // South Africa
  "Cape Town, South Africa",
  "Durban, South Africa",
  "Johannesburg, South Africa",
  "Pretoria, South Africa",

  // Brazil
  "Belo Horizonte, Brazil",
  "Brasilia, Brazil",
  "Curitiba, Brazil",
  "Rio de Janeiro, Brazil",
  "Sao Paulo, Brazil",

  // Mexico
  "Guadalajara, Mexico",
  "Mexico City, Mexico",
  "Monterrey, Mexico",

  // Argentina
  "Buenos Aires, Argentina",
  "Cordoba, Argentina",
  "Rosario, Argentina",

  // Chile
  "Santiago, Chile",

  // Colombia
  "Bogota, Colombia",
  "Medellin, Colombia",

  // Egypt
  "Alexandria, Egypt",
  "Cairo, Egypt",

  // Kenya
  "Nairobi, Kenya",

  // Nigeria
  "Abuja, Nigeria",
  "Lagos, Nigeria",

  // Turkey
  "Ankara, Turkey",
  "Istanbul, Turkey",

  // Malaysia
  "Kuala Lumpur, Malaysia",
  "Penang, Malaysia",

  // Thailand
  "Bangkok, Thailand",

  // Indonesia
  "Jakarta, Indonesia",

  // Philippines
  "Manila, Philippines",

  // Vietnam
  "Hanoi, Vietnam",
  "Ho Chi Minh City, Vietnam",

  // Pakistan
  "Islamabad, Pakistan",
  "Karachi, Pakistan",
  "Lahore, Pakistan",

  // Bangladesh
  "Dhaka, Bangladesh",

  // Sri Lanka
  "Colombo, Sri Lanka",

  // Nepal
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

      /*
       * The backend receives a valid date even when
       * the user is currently working.
       */
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

    /*
     * Backend field remains `description`.
     * Frontend label is `Responsibilities`.
     *
     * If currently working, always send today's date
     * instead of null.
     */
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
    <section>
      {!showForm ? (
        <>
          <h1>Experience</h1>

          <button
            type="button"
            onClick={openAddForm}
          >
            + Add Experience
          </button>

          {error && <p>{error}</p>}
          {success && <p>{success}</p>}

          <hr />

          {loading ? (
            <p>Loading experiences...</p>
          ) : experiences.length === 0 ? (
            <p>No experience found.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Role</th>
                  <th>Location</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Currently Working</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {experiences.map((experience) => (
                  <tr key={experience.id}>
                    <td>{experience.company}</td>
                    <td>{experience.role}</td>
                    <td>{experience.location}</td>
                    <td>{experience.start_date}</td>

                    <td>
                      {experience.is_current
                        ? "Present"
                        : experience.end_date}
                    </td>

                    <td>
                      {experience.is_current
                        ? "Yes"
                        : "No"}
                    </td>

                    <td>
                      <button
                        type="button"
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
                        onClick={() =>
                          handleDelete(
                            experience.id,
                          )
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
              ? "Edit Experience"
              : "Add Experience"}
          </h1>

          <form onSubmit={handleSubmit}>
            <div>
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
                required
              />
            </div>

            <div>
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

            <div>
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

            <div>
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

            <div>
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

            <div>
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

            <fieldset>
              <legend>
                Currently Working
              </legend>

              <label>
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
                No
              </label>

              <label>
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
                Yes
              </label>
            </fieldset>

            <div>
              <button
                type="submit"
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
                onClick={resetForm}
                disabled={saving}
              >
                Cancel
              </button>
            </div>
          </form>

          {error && <p>{error}</p>}
          {success && <p>{success}</p>}
        </>
      )}
    </section>
  );
}