import React from "react";
import "./DoctorCard.css";

function DoctorCard({ doctor, onSelect, isSelected }) {
  return (
    <div 
      className={`doctor-card ${isSelected ? 'selected' : ''}`} 
      onClick={() => onSelect(doctor)}
    >
      <div className="card-header">
        <div>
          <h3 className="doctor-name">{doctor.name}</h3>
          <p className="doctor-specialty">{doctor.specialty}</p>
        </div>
        <span className={`badge ${doctor.status === "Approuvé" ? "approved" : ""}`}>
          {doctor.status}
        </span>
      </div>
      <div className="doctor-meta">
        <p>📋 Numéro RPPS: {doctor.rpps}</p>
        <p>⭐ Expérience: {doctor.experience}</p>
        <p>📅 Soumis le: {doctor.submission}</p>
      </div>
    </div>
  );
}

export default DoctorCard;