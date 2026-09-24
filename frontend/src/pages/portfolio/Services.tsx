import { useEffect, useState } from "react";

import {
  getServices,
  type Service,
} from "../../api/services";
import Container from "../../components/portfolio/Container";

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadServices = async () => {
      try {
        const data = await getServices();
        setServices(data);
      } catch {
        setError("Unable to load services.");
      } finally {
        setLoading(false);
      }
    };

    loadServices();
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
            Services
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            What I Can Help With
          </h1>
        </div>

        <div className="mt-12 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <article
              key={service.id}
              className="border-b border-gray-200 pb-8"
            >
              {service.icon && (
                <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                  {service.icon}
                </p>
              )}

              <h2 className="mt-3 text-xl font-semibold">
                {service.title}
              </h2>

              <p className="mt-4 leading-7 text-gray-600">
                {service.description}
              </p>
            </article>
          ))}

          {services.length === 0 && (
            <p className="text-gray-500">
              No services available.
            </p>
          )}
        </div>
      </Container>
    </section>
  );
}