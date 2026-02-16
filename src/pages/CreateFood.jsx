import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./createfood.css";

const CreateFood = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleFile(e) {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!file) return setError("Please select a video file");
    if (!name) return setError("Please enter a name");

    const form = new FormData();
    form.append("name", name);
    form.append("description", description);
    form.append("video", file);

    try {
      const res = await axios.post("http://localhost:3000/api/food", form, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (ev) => {
          const p = Math.round((ev.loaded * 100) / ev.total);
          setProgress(p);
        },
      });

      if (res.data?.food) {
        // navigate to home after successful create
        navigate("/home");
      }
    } catch (err) {
      setError(err.response?.data?.messege || err.message || "Upload failed");
    }
  }

  return (
    <div className="upload-card create-food">
      <h3>Upload Food Video</h3>
      <form className="upload-form" onSubmit={handleSubmit}>
        <label>
          Name
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </label>

        <label>
          Description
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </label>

        <label className="file-field">
          {preview ? (
            <video src={preview} controls className="preview-video" />
          ) : (
            <div className="upload-drop">Select a video file</div>
          )}
          <input type="file" accept="video/*" onChange={handleFile} />
        </label>

        {error && <div className="error">{error}</div>}

        {progress > 0 && <div className="progress">Uploading {progress}%</div>}

        <div className="actions">
          <button type="submit" className="btn primary">
            Upload
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateFood;
