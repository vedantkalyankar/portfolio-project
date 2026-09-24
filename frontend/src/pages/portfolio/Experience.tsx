import { useEffect, useState } from "react";

import {
  getExperiences,
  type Experience as ExperienceData,
} from "../../api/experiences";
import Container from "../../components/portfolio/Container";

export default function Experience() {
  const [experiences, setExperiences] = useState<ExperienceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadExperiences = async () => {
      try {
        const data = await getExperiences();
        setExperiences(data);
      } catch {
        setError("Unable to load experience.");
      } finally {
        setLoading(false);
      }
    };

    loadExperiences();
  }, []);

  if (loading) {
    return (
      <section className="py-20">
        <Container>
          <p className="text-gray-500">Loading...</p>
        </Container>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20">
        <Container>
          <p className="text-gray-500">{error}</p>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-20">
      <Container>
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
            Experience
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            Professional Experience
          </h1>
        </div>

        <div className="mt-12 max-w-4xl space-y-12">
          {experiences.map((experience) => (
            <article
              key={experience.id}
              className="border-b border-gray-200 pb-10"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold">
                    {experience.role}
                  </h2>

                  <p className="mt-1 text-lg text-gray-600">
                    {experience.company}
                  </p>
                </div>

                <p className="text-sm text-gray-500">
                  {experience.start_date} —{" "}
                  {experience.is_current
                    ? "Present"
                    : experience.end_date ?? "N/A"}
                </p>
              </div>

              <p className="mt-2 text-sm text-gray-500">
                {experience.location}
              </p>

              <p className="mt-5 leading-7 text-gray-600">
                {experience.description}
              </p>
            </article>
          ))}

          {experiences.length === 0 && (
            <p className="text-gray-500">
              No experience available.
            </p>
          )}
        </div>
      </Container>
    </section>
  );
}