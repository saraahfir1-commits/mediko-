import React, { useState } from "react";
import "./DoctorDetails.css";

function DoctorDetails({ doctor, onApprove, onReject, onUploadDocuments }) {
  const [selectedFiles, setSelectedFiles] = useState([]);

  if (!doctor) {
    return (
      <div className="empty-state">
        <p>Sélectionnez un médecin pour voir les détails</p>
      </div>
    );
  }

  const handleFileChange = (e) => {
    setSelectedFiles([...e.target.files]);
  };

  const handleUpload = () => {
    if (selectedFiles.length === 0) {
      alert("Veuillez sélectionner au moins un fichier");
      return;
    }
    const documents = selectedFiles.map(file => ({
      name: file.name,
      size: (file.size / 1024).toFixed(1) + " KB",
      file: file
    }));
    onUploadDocuments(doctor.id, documents);
    setSelectedFiles([]);
    document.getElementById("fileInput").value = "";
  };

  return (
    <div className="doctor-details">
      <div className="details-header">
        <h2 className="details-name">{doctor.name}</h2>
        <p className="details-specialty">{doctor.specialty}</p>
      </div>

      <div className="details-content">
        <div className="info-row">
          <span className="info-label">Email</span>
          <span className="info-value">{doctor.email}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Téléphone</span>
          <span className="info-value">{doctor.phone}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Numéro RPPS</span>
          <span className="info-value">{doctor.rpps}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Années d'expérience</span>
          <span className="info-value">{doctor.experience}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Date de soumission</span>
          <span className="info-value">{doctor.submissionFull}</span>
        </div>

        <div className="section-title">Diplômes et certifications</div>
        <div className="diploma-list">
          {doctor.diplomas && doctor.diplomas.map((diploma, idx) => (
            <div key={idx} className="diploma-item">
              📜 {diploma}
            </div>
          ))}
        </div>

        {doctor.consultations && (
          <div className="consultations-badge">
            📊 Rendez-vous réalisés : {doctor.consultations}
          </div>
        )}

        <hr />

        <div className="upload-section">
          <label className="upload-label">📎 Déposer des documents justificatifs</label>
          <input
            id="fileInput"
            type="file"
            multiple
            onChange={handleFileChange}
            className="file-input"
            accept=".pdf,.jpg,.png,.jpeg"
          />
          <button className="btn-submit" onClick={handleUpload}>
            Envoyer les documents
          </button>
          
          {doctor.documents && doctor.documents.length > 0 && (
            <div className="uploaded-docs">
              <div className="section-title">Documents déposés</div>
              {doctor.documents.map((doc, idx) => (
                <div key={idx} className="doc-item">
                  📄 {doc.name}
                  <span className="doc-status">✓ déposé</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="action-buttons">
          <button 
            className="btn-approve" 
            onClick={() => onApprove(doctor.id)}
            disabled={doctor.status === "Approuvé"}
          >
            Approuver le médecin
          </button>
          <button 
            className="btn-reject" 
            onClick={() => onReject(doctor.id)}
            disabled={doctor.status === "Approuvé"}
          >
            Rejeter la demande
          </button>
        </div>

        {doctor.status === "Approuvé" && (
          <p className="status-message approved">✅ Médecin approuvé</p>
        )}
        {doctor.status === "Rejeté" && (
          <p className="status-message rejected">❌ Demande rejetée</p>
        )}
      </div>
    </div>
  );
}

export default DoctorDetails;