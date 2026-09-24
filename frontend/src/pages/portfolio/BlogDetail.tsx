import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  getBlogById,
  type Blog as BlogData,
} from "../../api/blogs";
import Container from "../../components/portfolio/Container";

export default function BlogDetail() {
  const { id } = useParams<{ id: string }>();

  const [blog, setBlog] = useState<BlogData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadBlog = async () => {
      if (!id) {
        setError("Blog article not found.");
        setLoading(false);
        return;
      }

      try {
        const data = await getBlogById(id);
        setBlog(data);
      } catch {
        setError("Unable to load this blog article.");
      } finally {
        setLoading(false);
      }
    };

    loadBlog();
  }, [id]);

  if (loading) {
    return (
      <section className="py-20">
        <Container>
          <p className="text-gray-500">Loading...</p>
        </Container>
      </section>
    );
  }

  if (error || !blog) {
    return (
      <section className="py-20">
        <Container>
          <p className="text-gray-500">
            {error || "Blog article is unavailable."}
          </p>

          <Link
            to="/blog"
            className="mt-6 inline-block text-sm font-semibold text-gray-900 hover:text-gray-600"
          >
            ← Back to Blog
          </Link>
        </Container>
      </section>
    );
  }

  return (
    <article className="py-20">
      <Container>
        <div className="max-w-3xl">
          <Link
            to="/blog"
            className="text-sm font-semibold text-gray-600 hover:text-black"
          >
            ← Back to Blog
          </Link>

          <div className="mt-10">
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
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

            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
              {blog.title}
            </h1>

            <p className="mt-6 text-xl leading-8 text-gray-600">
              {blog.excerpt}
            </p>

            <div className="mt-10 border-t border-gray-200 pt-10">
              <div className="whitespace-pre-line text-lg leading-8 text-gray-700">
                {blog.content}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </article>
  );
}