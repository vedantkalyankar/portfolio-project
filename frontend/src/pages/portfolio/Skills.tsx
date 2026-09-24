import { useEffect, useState } from "react";

import {
  getSkills,
  type Skill,
} from "../../api/skills";
import Container from "../../components/portfolio/Container";

export default function Skills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSkills = async () => {
      try {
        const data = await getSkills();
        setSkills(data.items);
      } catch {
        setError("Unable to load skills.");
      } finally {
        setLoading(false);
      }
    };

    loadSkills();
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
            Skills
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            Technical Skills
          </h1>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((skill) => (
            <div
              key={skill.id}
              className="border-b border-gray-200 pb-6"
            >
              <h2 className="text-lg font-semibold">
                {skill.name}
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                {skill.category}
              </p>

              <p className="mt-3 text-sm text-gray-700">
                {skill.proficiency}
              </p>
            </div>
          ))}
        </div>

        {skills.length === 0 && (
          <p className="mt-12 text-gray-500">
            No skills available.
          </p>
        )}
      </Container>
    </section>
  );
}