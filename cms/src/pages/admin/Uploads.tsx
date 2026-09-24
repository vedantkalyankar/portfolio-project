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
    setLoading(true);
    setError("");

    try {
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

    setUploading(true);
    setError("");
    setSuccess("");

    try {
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
    <section>
      <h1>Uploads</h1>

      <div
        style={{
          marginBottom: "30px",
          paddingBottom: "20px",
          borderBottom: "1px solid #ddd",
        }}
      >
        <h2>Upload File</h2>

        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          disabled={uploading}
        />

        <p>
          All file types are allowed.
          <br />
          Maximum size: 5 MB.
        </p>

        {selectedFile && (
          <div style={{ marginTop: "15px" }}>
            <p>
              <strong>Selected file:</strong>{" "}
              {selectedFile.name}
            </p>

            <p>
              <strong>Size:</strong>{" "}
              {formatFileSize(selectedFile.size)}
            </p>

            <p>
              <strong>Type:</strong>{" "}
              {selectedFile.type || "Unknown"}
            </p>

            <button
              onClick={handleUpload}
              disabled={uploading}
              style={{ marginRight: "10px" }}
            >
              {uploading
                ? "Uploading..."
                : "Upload File"}
            </button>

            <button
              onClick={handleClear}
              disabled={uploading}
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}

      {success && (
        <p style={{ color: "green" }}>
          {success}
        </p>
      )}

      <h2>Uploaded Files</h2>

      {loading && (
        <p>Loading uploaded files...</p>
      )}

      {!loading && uploads.length === 0 && (
        <p>No files uploaded yet.</p>
      )}

      {!loading && uploads.length > 0 && (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  textAlign: "left",
                  padding: "10px",
                  borderBottom: "1px solid #ddd",
                }}
              >
                Filename
              </th>

              <th
                style={{
                  textAlign: "left",
                  padding: "10px",
                  borderBottom: "1px solid #ddd",
                }}
              >
                Type
              </th>

              <th
                style={{
                  textAlign: "left",
                  padding: "10px",
                  borderBottom: "1px solid #ddd",
                }}
              >
                Size
              </th>

              <th
                style={{
                  textAlign: "left",
                  padding: "10px",
                  borderBottom: "1px solid #ddd",
                }}
              >
                Uploaded
              </th>

              <th
                style={{
                  textAlign: "left",
                  padding: "10px",
                  borderBottom: "1px solid #ddd",
                }}
              >
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {uploads.map((upload) => (
              <tr key={upload.id}>
                <td
                  style={{
                    padding: "10px",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  {upload.original_filename}
                </td>

                <td
                  style={{
                    padding: "10px",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  {upload.content_type || "Unknown"}
                </td>

                <td
                  style={{
                    padding: "10px",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  {formatFileSize(upload.file_size)}
                </td>

                <td
                  style={{
                    padding: "10px",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  {formatDate(upload.created_at)}
                </td>

                <td
                  style={{
                    padding: "10px",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <a
                    href={getFileUrl(upload.id)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}