import React, { useState } from "react";

function DoctorUploadForm({ onSubmit }) {
  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const documents = files.map((file) => ({
      name: file.name,
      file: URL.createObjectURL(file)
    }));
    onSubmit(documents);
    setFiles([]);
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <h3>Déposer vos documents</h3>
      <input
        type="file"
        multiple
        onChange={handleFileChange}
        accept=".pdf,.jpg,.png"
      />
      <button type="submit">Envoyer</button>
    </form>
  );
}

export default DoctorUploadForm;