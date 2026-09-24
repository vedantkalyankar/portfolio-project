import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
} from "react";

import {
  getUploads,
  uploadFile,
  type Upload,
} from "../../api/uploads";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function formatDate(date: string): string {
  return new Date(date).toLocaleString();
}

function getFileUrl(uploadId: string): string {
  const baseUrl =
    import.meta.env.VITE_API_BASE_URL ||
    "http://127.0.0.1:8000/api/v1";

  return `${baseUrl}/uploads/${uploadId}`;
}

export default function Uploads() {
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fileInputRef =
    useRef<HTMLInputElement | null>(null);

  const loadUploads = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getUploads();

      setUploads(data);
    } catch (error: any) {
      const detail = error.response?.data?.detail;

      if (typeof detail === "string") {
        setError(detail);
      } else {
        setError("Failed to load uploaded files.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUploads();
  }, []);

  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    setError("");
    setSuccess("");

    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setSelectedFile(null);
      event.target.value = "";

      setError("File size must not exceed 5 MB.");

      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file first.");
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setError("File size must not exceed 5 MB.");
      return;
    }

    try {
      setUploading(true);
      setError("");
      setSuccess("");

      await uploadFile(selectedFile);

      setSuccess("File uploaded successfully.");

      setSelectedFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      await loadUploads();
    } catch (error: any) {
      const detail = error.response?.data?.detail;

      if (typeof detail === "string") {
        setError(detail);
      } else if (Array.isArray(detail)) {
        setError(
          detail
            .map((item: any) => item.msg)
            .join(", "),
        );
      } else {
        setError("Failed to upload file.");
      }
    } finally {
      setUploading(false);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setError("");
    setSuccess("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="crud-page">
      <section className="crud-header">
        <div>
          <p className="crud-eyebrow">
            MEDIA MANAGEMENT
          </p>

          <h1>Uploads</h1>

          <p className="crud-description">
            Upload and manage files used by your
            portfolio.
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
            <h2>Upload file</h2>

            <p>
              Select a file to upload to your portfolio
              media storage.
            </p>
          </div>
        </div>

        <div className="crud-form">
          <div className="crud-field">
            <label htmlFor="upload-file">
              File
            </label>

            <input
              ref={fileInputRef}
              id="upload-file"
              type="file"
              onChange={handleFileChange}
              disabled={uploading}
            />

            <p className="crud-field-help">
              All file types are allowed. Maximum file
              size is 5 MB.
            </p>
          </div>

          {selectedFile && (
            <div className="upload-preview">
              <div className="upload-preview-header">
                <div>
                  <p className="upload-preview-label">
                    Selected file
                  </p>

                  <h3>{selectedFile.name}</h3>
                </div>
              </div>

              <div className="upload-file-details">
                <div>
                  <span>Size</span>
                  <strong>
                    {formatFileSize(
                      selectedFile.size,
                    )}
                  </strong>
                </div>

                <div>
                  <span>Type</span>
                  <strong>
                    {selectedFile.type || "Unknown"}
                  </strong>
                </div>
              </div>

              <div className="crud-form-actions">
                <button
                  type="button"
                  className="crud-button crud-button-primary"
                  onClick={handleUpload}
                  disabled={uploading}
                >
                  {uploading
                    ? "Uploading..."
                    : "Upload File"}
                </button>

                <button
                  type="button"
                  className="crud-button crud-button-secondary"
                  onClick={handleClear}
                  disabled={uploading}
                >
                  Clear
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="crud-list-section">
        <div className="crud-section-header">
          <div>
            <h2>Uploaded files</h2>

            <p>
              View files currently stored in the portfolio
              media library.
            </p>
          </div>

          <div className="crud-section-count">
            {uploads.length}{" "}
            {uploads.length === 1
              ? "file"
              : "files"}
          </div>
        </div>

        {loading ? (
          <div className="crud-state">
            <p>Loading uploaded files...</p>
          </div>
        ) : uploads.length === 0 ? (
          <div className="crud-state">
            <h3>No files uploaded yet</h3>

            <p>
              Upload your first file using the form above.
            </p>
          </div>
        ) : (
          <div className="crud-table-wrapper">
            <table className="crud-table">
              <thead>
                <tr>
                  <th>Filename</th>
                  <th>Type</th>
                  <th>Size</th>
                  <th>Uploaded</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {uploads.map((upload) => (
                  <tr key={upload.id}>
                    <td>
                      <div className="crud-project-title">
                        {upload.original_filename}
                      </div>
                    </td>

                    <td>
                      <span className="crud-skill-category">
                        {upload.content_type ||
                          "Unknown"}
                      </span>
                    </td>

                    <td>
                      <span className="crud-skill-category">
                        {formatFileSize(
                          upload.file_size,
                        )}
                      </span>
                    </td>

                    <td>
                      <span className="crud-blog-date">
                        {formatDate(
                          upload.created_at,
                        )}
                      </span>
                    </td>

                    <td>
                      <div className="crud-row-actions">
                        <a
                          href={getFileUrl(upload.id)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="crud-button crud-button-small"
                        >
                          Open
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}