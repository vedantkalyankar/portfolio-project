import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAbout, type About } from "../../api/about";
import Container from "../../components/portfolio/Container";

export default function Home() {
  const [about, setAbout] = useState<About | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAbout = async () => {
      try {
        const data = await getAbout();

        setAbout(data);
      } catch {
        setError("Unable to load portfolio information.");
      } finally {
        setLoading(false);
      }
    };

    loadAbout();
  }, []);

  if (loading) {
    return (
      <section className="flex min-h-[calc(100vh-73px)] items-center">
        <Container>
          <p className="text-gray-500">Loading...</p>
        </Container>
      </section>
    );
  }

  if (error || !about) {
    return (
      <section className="flex min-h-[calc(100vh-73px)] items-center">
        <Container>
          <p className="text-gray-500">
            {error || "Portfolio information is unavailable."}
          </p>
        </Container>
      </section>
    );
  }

  return (
  <section className="min-h-[calc(100vh-73px)] flex items-center">
    <Container>
      <div className="max-w-4xl py-20 sm:py-24 lg:py-32">
        <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
          {about.title}
        </p>

        <h1 className="mt-5 text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
          {about.name}
        </h1>

        <p className="mt-8 max-w-2xl text-lg leading-8 text-gray-600 sm:text-xl">
          {about.bio}
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link
  to="/projects"
  className="border border-gray-900 bg-gray-900 px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-gray-800"
>
  View Projects
</Link>

          <a
            href={`mailto:${about.email}`}
            className="border border-gray-300 px-6 py-3 text-center text-sm font-semibold text-gray-900 transition hover:border-gray-900"
          >
            Contact Me
          </a>
        </div>

        <div className="mt-8 flex gap-6 text-sm">
          <a
            href={about.github_url}
            target="_blank"
            rel="noreferrer"
            className="text-gray-600 hover:text-black"
          >
            GitHub
          </a>

          <a
            href={about.linkedin_url}
            target="_blank"
            rel="noreferrer"
            className="text-gray-600 hover:text-black"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </Container>
  </section>
);
}