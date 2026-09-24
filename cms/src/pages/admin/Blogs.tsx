import { useEffect, useState, type FormEvent } from "react";

import {
  createBlog,
  deleteBlog,
  getBlog,
  getBlogs,
  updateBlog,
  type Blog,
} from "../../api/blogs";

interface BlogForm {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  published: boolean;
}

const EMPTY_FORM: BlogForm = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  published: false,
};

export default function Blogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [form, setForm] = useState<BlogForm>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadBlogs = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getBlogs();
      setBlogs(data);
    } catch {
      setError("Failed to load blogs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  const handleChange = (
    field: keyof BlogForm,
    value: string | boolean,
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      if (editingId) {
        await updateBlog(editingId, form);
        setSuccess("Blog updated successfully.");
      } else {
        await createBlog(form);
        setSuccess("Blog created successfully.");
      }

      resetForm();
      await loadBlogs();
    } catch {
      setError(
        editingId
          ? "Failed to update blog."
          : "Failed to create blog.",
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
    } catch {
      setError("Failed to load blog.");
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this blog?",
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      await deleteBlog(id);

      if (editingId === id) {
        resetForm();
      }

      setSuccess("Blog deleted successfully.");
      await loadBlogs();
    } catch {
      setError("Failed to delete blog.");
    }
  };

  return (
    <section>
      <h1>{editingId ? "Edit Blog" : "Add Blog"}</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="blog-title">Title</label>
          <input
            id="blog-title"
            type="text"
            value={form.title}
            onChange={(event) =>
              handleChange("title", event.target.value)
            }
            required
          />
        </div>

        <div>
          <label htmlFor="blog-slug">Slug</label>
          <input
            id="blog-slug"
            type="text"
            value={form.slug}
            onChange={(event) =>
              handleChange("slug", event.target.value)
            }
            required
          />
        </div>

        <div>
          <label htmlFor="blog-excerpt">Excerpt</label>
          <textarea
            id="blog-excerpt"
            value={form.excerpt}
            onChange={(event) =>
              handleChange("excerpt", event.target.value)
            }
            required
          />
        </div>

        <div>
          <label htmlFor="blog-content">Content</label>
          <textarea
            id="blog-content"
            rows={10}
            value={form.content}
            onChange={(event) =>
              handleChange("content", event.target.value)
            }
            required
          />
        </div>

        <div>
          <label htmlFor="blog-published">Published</label>

          <select
            id="blog-published"
            value={form.published ? "true" : "false"}
            onChange={(event) =>
              handleChange(
                "published",
                event.target.value === "true",
              )
            }
          >
            <option value="false">Draft</option>
            <option value="true">Published</option>
          </select>
        </div>

        <div>
          <button type="submit" disabled={saving}>
            {saving
              ? "Saving..."
              : editingId
                ? "Update Blog"
                : "Add Blog"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              disabled={saving}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {error && <p>{error}</p>}
      {success && <p>{success}</p>}

      <hr />

      <h2>Blogs</h2>

      {loading ? (
        <p>Loading blogs...</p>
      ) : blogs.length === 0 ? (
        <p>No blogs found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Slug</th>
              <th>Published</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {blogs.map((blog) => (
              <tr key={blog.id}>
                <td>{blog.title}</td>
                <td>{blog.slug}</td>
                <td>
                  {blog.published ? "Published" : "Draft"}
                </td>
                <td>
                  {new Date(
                    blog.created_at,
                  ).toLocaleDateString()}
                </td>
                <td>
                  <button
                    type="button"
                    onClick={() => handleEdit(blog.id)}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(blog.id)
                    }
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}