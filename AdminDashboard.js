import React, { useState, useEffect } from "react";
import DoctorCard from "./DoctorCard";
import DoctorDetails from "./DoctorDetails";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [currentFilter, setCurrentFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Données initiales des médecins
  const initialDoctors = [
    {
      id: 1,
      name: "Dr. Sophie Dubois",
      specialty: "Cardiologie",
      rpps: "RPPS 10023456789",
      experience: "12 ans",
      submission: "08/04/2026",
      submissionFull: "8 avril 2026",
      status: "En attente",
      email: "sophie.dubois@medical.fr",
      phone: "+33 6 12 34 56 78",
      diplomas: [
        "Diplôme de médecine - Université Paris",
        "Spécialisation Cardiologie - CHU Paris",
        "Certification Échocardiographie"
      ],
      documents: []
    },
    {
      id: 2,
      name: "Dr. Marc Lefèvre",
      specialty: "Pédiatrie",
      rpps: "RPPS 10034567890",
      experience: "8 ans",
      submission: "09/04/2026",
      submissionFull: "9 avril 2026",
      status: "En attente",
      email: "marc.lefevre@medical.fr",
      phone: "+33 6 23 45 67 89",
      diplomas: [
        "Diplôme de médecine - Université Lyon",
        "Spécialisation Pédiatrie",
        "Formation Néonatalogie"
      ],
      documents: []
    },
    {
      id: 3,
      name: "Dr. Claire Martin",
      specialty: "Dermatologie",
      rpps: "RPPS 10045678901",
      experience: "15 ans",
      submission: "10/04/2026",
      submissionFull: "10 avril 2026",
      status: "En attente",
      email: "claire.martin@medical.fr",
      phone: "+33 6 34 56 78 90",
      diplomas: [
        "Diplôme de médecine - Université Bordeaux",
        "Spécialisation Dermatologie",
        "Diplôme Laser Médical"
      ],
      documents: []
    },
    {
      id: 4,
      name: "Dr. Ahmed Benali",
      specialty: "Médecine Générale",
      rpps: "RPPS 10056789012",
      experience: "20 ans",
      submission: "05/04/2026",
      submissionFull: "5 avril 2026",
      status: "Approuvé",
      email: "ahmed.benali@medical.fr",
      phone: "+33 6 45 67 89 01",
      diplomas: [
        "Diplôme de médecine - Université Marseille",
        "Médecine Générale",
        "Formation Gériatrie"
      ],
      consultations: "143 consultations",
      documents: []
    },
    {
      id: 5,
      name: "Dr. Émilie Rousseau",
      specialty: "Psychiatrie",
      rpps: "RPPS 10067890123",
      experience: "10 ans",
      submission: "11/04/2026",
      submissionFull: "11 avril 2026",
      status: "En attente",
      email: "emilie.rousseau@medical.fr",
      phone: "+33 6 56 78 90 12",
      diplomas: [
        "Diplôme de médecine - Université Strasbourg",
        "Spécialisation Psychiatrie",
        "Master en Thérapies Cognitives"
      ],
      documents: []
    }
  ];

  useEffect(() => {
    setDoctors(initialDoctors);
  }, []);

  useEffect(() => {
    filterDoctors();
  }, [doctors, currentFilter, searchQuery]);

  const filterDoctors = () => {
    let filtered = [...doctors];
    
    if (currentFilter === "pending") {
      filtered = filtered.filter(d => d.status === "En attente");
    } else if (currentFilter === "approved") {
      filtered = filtered.filter(d => d.status === "Approuvé");
    }
    
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(d =>
        d.name.toLowerCase().includes(query) ||
        d.specialty.toLowerCase().includes(query) ||
        d.rpps.toLowerCase().includes(query)
      );
    }
    
    setFilteredDoctors(filtered);
    
    if (selectedDoctor && !filtered.find(d => d.id === selectedDoctor.id)) {
      setSelectedDoctor(filtered[0] || null);
    }
  };

  const handleApprove = (doctorId) => {
    const updatedDoctors = doctors.map(doctor =>
      doctor.id === doctorId && doctor.status !== "Approuvé"
        ? { ...doctor, status: "Approuvé" }
        : doctor
    );
    setDoctors(updatedDoctors);
    alert(`✅ Le médecin a été approuvé`);
  };

  const handleReject = (doctorId) => {
    const updatedDoctors = doctors.map(doctor =>
      doctor.id === doctorId && doctor.status !== "Approuvé"
        ? { ...doctor, status: "Rejeté" }
        : doctor
    );
    setDoctors(updatedDoctors);
    alert(`❌ La demande a été rejetée`);
  };

  const handleUploadDocuments = (doctorId, documents) => {
    const updatedDoctors = doctors.map(doctor =>
      doctor.id === doctorId
        ? { ...doctor, documents: [...(doctor.documents || []), ...documents] }
        : doctor
    );
    setDoctors(updatedDoctors);
    alert(`${documents.length} document(s) téléchargé(s) avec succès`);
  };

  const getStats = () => {
    const pending = doctors.filter(d => d.status === "En attente").length;
    const approved = doctors.filter(d => d.status === "Approuvé").length;
    const total = doctors.length;
    return { pending, approved, total };
  };

  const stats = getStats();

  return (
    <div className="admin-container">
      {/* Header avec logo */}
      <div className="main-header">
        <div className="logo-area">
          <div className="logo-circle">M</div>
          <div className="logo-text">Medi<span>ko</span></div>
        </div>
        <div className="header-right">
          <div className="admin-badge">👨‍⚕️ Administration</div>
          <div className="admin-badge">📅 {new Date().toLocaleDateString('fr-FR')}</div>
        </div>
      </div>

      <div className="title-section">
        <h1 className="title">Administration Médicale</h1>
        <p className="subtitle">Vérification et validation des médecins</p>
      </div>

      <div className="stats">
        <div className="stat-card">
          <p>En attente</p>
          <span className="stat-number">{stats.pending}</span>
        </div>
        <div className="stat-card">
          <p>Approuvés</p>
          <span className="stat-number">{stats.approved}</span>
        </div>
        <div className="stat-card">
          <p>Total médecins</p>
          <span className="stat-number">{stats.total}</span>
        </div>
      </div>

      <div className="search-section">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Rechercher un médecin... (Nom, spécialité, RPPS)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="filter-tabs">
        <button
          className={`filter-btn ${currentFilter === "all" ? "active" : ""}`}
          onClick={() => setCurrentFilter("all")}
        >
          Tous
        </button>
        <button
          className={`filter-btn ${currentFilter === "pending" ? "active" : ""}`}
          onClick={() => setCurrentFilter("pending")}
        >
          En attente
        </button>
        <button
          className={`filter-btn ${currentFilter === "approved" ? "active" : ""}`}
          onClick={() => setCurrentFilter("approved")}
        >
          Approuvés
        </button>
      </div>

      <div className="content">
        <div className="left">
          {filteredDoctors.length === 0 ? (
            <div className="empty-state">Aucun médecin trouvé</div>
          ) : (
            filteredDoctors.map((doctor) => (
              <DoctorCard
                key={doctor.id}
                doctor={doctor}
                onSelect={setSelectedDoctor}
                isSelected={selectedDoctor?.id === doctor.id}
              />
            ))
          )}
        </div>
        <div className="right">
          <DoctorDetails
            doctor={selectedDoctor}
            onApprove={handleApprove}
            onReject={handleReject}
            onUploadDocuments={handleUploadDocuments}
          />
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;