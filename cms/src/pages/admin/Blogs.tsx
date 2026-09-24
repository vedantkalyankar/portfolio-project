import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import {
  createBlog,
  deleteBlog,
  getBlog,
  getBlogs,
  updateBlog,
  type Blog,
  type BlogCreateRequest,
} from "../../api/blogs";

const EMPTY_FORM: BlogCreateRequest = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  published: false,
};

export default function Blogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  const [form, setForm] =
    useState<BlogCreateRequest>(EMPTY_FORM);

  const [editingId, setEditingId] = useState<string | null>(
    null,
  );

  const [showForm, setShowForm] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadBlogs = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getBlogs();

      setBlogs(data);
    } catch {
      setError("Failed to load blog posts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  const handleChange = (
    field: keyof BlogCreateRequest,
    value: string | boolean,
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setSuccess("");
  };

  const openAddForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setError("");
    setSuccess("");
    setShowForm(true);
  };

  const cancelForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setError("");
    setSuccess("");
    setShowForm(false);
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (editingId) {
        await updateBlog(editingId, form);

        setSuccess(
          "Blog post updated successfully.",
        );
      } else {
        await createBlog(form);

        setSuccess(
          "Blog post created successfully.",
        );
      }

      setForm(EMPTY_FORM);
      setEditingId(null);
      setShowForm(false);

      await loadBlogs();
    } catch {
      setError(
        editingId
          ? "Failed to update blog post."
          : "Failed to create blog post.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (id: string) => {
    setError("");
    setSuccess("");

    try {
      const blog = await getBlog(id);

      setForm({
        title: blog.title,
        slug: blog.slug,
        excerpt: blog.excerpt,
        content: blog.content,
        published: blog.published,
      });

      setEditingId(blog.id);
      setShowForm(true);
    } catch {
      setError("Failed to load blog post.");
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this blog post?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await deleteBlog(id);

      setSuccess(
        "Blog post deleted successfully.",
      );

      if (editingId === id) {
        cancelForm();
      } else {
        await loadBlogs();
      }
    } catch {
      setError("Failed to delete blog post.");
    }
  };

  return (
    <div className="crud-page">
      {!showForm ? (
        <>
          <section className="crud-header">
            <div>
              <p className="crud-eyebrow">
                PORTFOLIO CONTENT
              </p>

              <h1>Blogs</h1>

              <p className="crud-description">
                Manage the articles and blog posts
                published on your portfolio.
              </p>
            </div>

            <div className="crud-header-action">
              <button
                type="button"
                className="crud-button crud-button-primary"
                onClick={openAddForm}
              >
                + Add Blog
              </button>
            </div>
          </section>

          {error && (
            <div
              className="crud-message crud-message-error"
              role="alert"
            >
              {error}
            </div>
          )}

          {success && (
            <div
              className="crud-message crud-message-success"
              role="status"
            >
              {success}
            </div>
          )}

          <section className="crud-list-section">
            <div className="crud-section-header">
              <div>
                <h2>Blog list</h2>

                <p>
                  View and manage your existing blog
                  posts.
                </p>
              </div>

              <div className="crud-section-count">
                {blogs.length}{" "}
                {blogs.length === 1
                  ? "post"
                  : "posts"}
              </div>
            </div>

            {loading ? (
              <div className="crud-state">
                <p>Loading blog posts...</p>
              </div>
            ) : blogs.length === 0 ? (
              <div className="crud-state">
                <h3>No blog posts yet</h3>

                <p>
                  Add your first blog post using the
                  button above.
                </p>
              </div>
            ) : (
              <div className="crud-table-wrapper">
                <table className="crud-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Slug</th>
                      <th>Status</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {blogs.map((blog) => (
                      <tr key={blog.id}>
                        <td>
                          <div className="crud-project-title">
                            {blog.title}
                          </div>
                        </td>

                        <td>
                          <span className="crud-blog-slug">
                            /{blog.slug}
                          </span>
                        </td>

                        <td>
                          <span
                            className={`crud-status-badge ${
                              blog.published
                                ? "crud-status-published"
                                : "crud-status-draft"
                            }`}
                          >
                            {blog.published
                              ? "Published"
                              : "Draft"}
                          </span>
                        </td>

                        <td>
                          <span className="crud-blog-date">
                            {new Date(
                              blog.created_at,
                            ).toLocaleDateString()}
                          </span>
                        </td>

                        <td>
                          <div className="crud-row-actions">
                            <button
                              type="button"
                              className="crud-button crud-button-small"
                              onClick={() =>
                                handleEdit(
                                  blog.id,
                                )
                              }
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              className="crud-button crud-button-small crud-button-danger"
                              onClick={() =>
                                handleDelete(
                                  blog.id,
                                )
                              }
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      ) : (
        <>
          <section className="crud-header">
            <div>
              <p className="crud-eyebrow">
                PORTFOLIO CONTENT
              </p>

              <h1>
                {editingId
                  ? "Edit Blog"
                  : "Add Blog"}
              </h1>

              <p className="crud-description">
                {editingId
                  ? "Update the blog post information below."
                  : "Create a new article for your portfolio."}
              </p>
            </div>
          </section>

          {error && (
            <div
              className="crud-message crud-message-error"
              role="alert"
            >
              {error}
            </div>
          )}

          {success && (
            <div
              className="crud-message crud-message-success"
              role="status"
            >
              {success}
            </div>
          )}

          <section className="crud-form-section">
            <div className="crud-section-header">
              <div>
                <h2>Blog details</h2>

                <p>
                  Enter the content and publishing
                  information for your blog post.
                </p>
              </div>
            </div>

            <form
              className="crud-form"
              onSubmit={handleSubmit}
            >
              <div className="crud-form-grid">
                <div className="crud-field">
                  <label htmlFor="blog-title">
                    Title
                  </label>

                  <input
                    id="blog-title"
                    type="text"
                    value={form.title}
                    onChange={(event) =>
                      handleChange(
                        "title",
                        event.target.value,
                      )
                    }
                    placeholder="Enter blog title"
                    required
                  />
                </div>

                <div className="crud-field">
                  <label htmlFor="blog-slug">
                    Slug
                  </label>

                  <input
                    id="blog-slug"
                    type="text"
                    value={form.slug}
                    onChange={(event) =>
                      handleChange(
                        "slug",
                        event.target.value,
                      )
                    }
                    placeholder="my-blog-post"
                    required
                  />
                </div>
              </div>

              <div className="crud-field">
                <label htmlFor="blog-excerpt">
                  Excerpt
                </label>

                <textarea
                  id="blog-excerpt"
                  rows={4}
                  value={form.excerpt}
                  onChange={(event) =>
                    handleChange(
                      "excerpt",
                      event.target.value,
                    )
                  }
                  placeholder="Write a short summary of the blog post."
                  required
                />
              </div>

              <div className="crud-field">
                <label htmlFor="blog-content">
                  Content
                </label>

                <textarea
                  id="blog-content"
                  rows={12}
                  value={form.content}
                  onChange={(event) =>
                    handleChange(
                      "content",
                      event.target.value,
                    )
                  }
                  placeholder="Write the full blog content here."
                  required
                />
              </div>

              <fieldset className="crud-radio-field">
                <legend>Publishing status</legend>

                <div className="crud-radio-group">
                  <label className="crud-radio-option">
                    <input
                      type="radio"
                      name="blog-published"
                      checked={!form.published}
                      onChange={() =>
                        handleChange(
                          "published",
                          false,
                        )
                      }
                    />

                    <span>Draft</span>
                  </label>

                  <label className="crud-radio-option">
                    <input
                      type="radio"
                      name="blog-published"
                      checked={form.published}
                      onChange={() =>
                        handleChange(
                          "published",
                          true,
                        )
                      }
                    />

                    <span>Published</span>
                  </label>
                </div>
              </fieldset>

              <div className="crud-form-actions">
                <button
                  type="submit"
                  className="crud-button crud-button-primary"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Update Blog"
                      : "Add Blog"}
                </button>

                <button
                  type="button"
                  className="crud-button crud-button-secondary"
                  onClick={cancelForm}
                  disabled={saving}
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        </>
      )}
    </div>
  );
}