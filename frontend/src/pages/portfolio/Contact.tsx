import { useEffect, useState } from "react";

import {
  getAbout,
  type About as AboutData,
} from "../../api/about";
import Container from "../../components/portfolio/Container";

export default function Contact() {
  const [about, setAbout] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAbout = async () => {
      try {
        const data = await getAbout();
        setAbout(data);
      } catch {
        setError("Unable to load contact information.");
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
            {error || "Contact information is unavailable."}
          </p>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-20">
      <Container>
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
            Contact
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            Let's Connect
          </h1>

          <p className="mt-6 text-lg leading-8 text-gray-600">
            If you would like to discuss an opportunity, project,
            or collaboration, feel free to get in touch.
          </p>

          <div className="mt-12 space-y-6">
            <div>
              <p className="text-sm font-semibold text-gray-900">
                Email
              </p>

              <a
                href={`mailto:${about.email}`}
                className="mt-2 inline-block text-gray-600 hover:text-black"
              >
                {about.email}
              </a>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-900">
                Location
              </p>

              <p className="mt-2 text-gray-600">
                {about.location}
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-900">
                Online
              </p>

              <div className="mt-2 flex gap-6">
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
          </div>
        </div>
      </Container>
    </section>
  );
}