import { useEffect, useState } from "react";

import {
  getTestimonials,
  type Testimonial,
} from "../../api/testimonials";
import Container from "../../components/portfolio/Container";

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        const data = await getTestimonials();
        setTestimonials(data);
      } catch {
        setError("Unable to load testimonials.");
      } finally {
        setLoading(false);
      }
    };

    loadTestimonials();
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
            Testimonials
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            What People Say
          </h1>
        </div>

        <div className="mt-12 grid gap-10 md:grid-cols-2">
          {testimonials.map((testimonial) => (
            <article
              key={testimonial.id}
              className="border-b border-gray-200 pb-8"
            >
              <p className="text-lg leading-8 text-gray-600">
                “{testimonial.content}”
              </p>

              <div className="mt-6">
                <p className="font-semibold text-gray-900">
                  {testimonial.name}
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  {testimonial.role}
                  {testimonial.company &&
                    ` · ${testimonial.company}`}
                </p>
              </div>
            </article>
          ))}

          {testimonials.length === 0 && (
            <p className="text-gray-500">
              No testimonials available.
            </p>
          )}
        </div>
      </Container>
    </section>
  );
}