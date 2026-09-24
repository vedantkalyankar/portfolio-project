import { useEffect, useState } from "react";

import { getAbout, type About as AboutData } from "../../api/about";
import Container from "../../components/portfolio/Container";

export default function About() {
  const [about, setAbout] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAbout = async () => {
      try {
        const data = await getAbout();
        setAbout(data);
      } catch {
        setError("Unable to load about information.");
      } finally {
        setLoading(false);
      }
    };

    loadAbout();
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

  if (error || !about) {
    return (
      <section className="py-20">
        <Container>
          <p className="text-gray-500">
            {error || "About information is unavailable."}
          </p>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-20">
      <Container>
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">
            About Me
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            {about.name}
          </h1>

          <p className="mt-4 text-xl text-gray-600">
            {about.title}
          </p>

          <p className="mt-8 text-lg leading-8 text-gray-600">
            {about.bio}
          </p>

          <div className="mt-10 space-y-4 text-sm text-gray-600">
  <p>
    <span className="font-semibold text-gray-900">
      Email:
    </span>{" "}
    <a
      href={`mailto:${about.email}`}
      className="hover:text-black"
    >
      {about.email}
    </a>
  </p>

  <p>
    <span className="font-semibold text-gray-900">
      Location:
    </span>{" "}
    {about.location}
  </p>

  <div className="flex gap-6 pt-2">
    <a
      href={about.github_url}
      target="_blank"
      rel="noreferrer"
      className="font-semibold text-gray-900 hover:text-gray-600"
    >
      GitHub
    </a>

    <a
      href={about.linkedin_url}
      target="_blank"
      rel="noreferrer"
      className="font-semibold text-gray-900 hover:text-gray-600"
    >
      LinkedIn
    </a>
  </div>
</div>
        </div>
      </Container>
    </section>
  );
}