import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  getBlogs,
  type Blog as BlogData,
} from "../../api/blogs";
import Container from "../../components/portfolio/Container";

export default function Blog() {
  const [blogs, setBlogs] = useState<BlogData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        const data = await getBlogs();
        setBlogs(data);
      } catch {
        setError("Unable to load blogs.");
      } finally {
        setLoading(false);
      }
    };

    loadBlogs();
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
            Blog
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            Articles & Insights
          </h1>

          <p className="mt-6 text-lg leading-8 text-gray-600">
            Thoughts, technical articles, and lessons from my
            development journey.
          </p>
        </div>

        <div className="mt-12 grid gap-10 md:grid-cols-2">
          {blogs.map((blog) => (
            <article
              key={blog.id}
              className="border-b border-gray-200 pb-8"
            >
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <span>
                  {new Date(blog.created_at).toLocaleDateString()}
                </span>

                {blog.published && (
                  <>
                    <span>·</span>
                    <span>Published</span>
                  </>
                )}
              </div>

              <h2 className="mt-4 text-2xl font-semibold">
                {blog.title}
              </h2>

              <p className="mt-4 leading-7 text-gray-600">
                {blog.excerpt}
              </p>

              <Link
                to={`/blog/${blog.id}`}
                className="mt-6 inline-block text-sm font-semibold text-gray-900 hover:text-gray-600"
              >
                Read Article →
              </Link>
            </article>
          ))}

          {blogs.length === 0 && (
            <p className="text-gray-500">
              No blog articles available.
            </p>
          )}
        </div>
      </Container>
    </section>
  );
}