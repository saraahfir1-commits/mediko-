
import { Link } from 'react-router-dom';
import { useState, useContext } from 'react';
import { symptomMap } from "./utils/symptomMap.js";
import { NotificationsContext } from './contexts/NotificationsContext';
import Header from './Header';

const doctors = [
  { id: 1, name: "Dr. Marie Dupont", specialty: "Médecin généraliste", city: "Paris", phone: "01 42 33 44 55", teleconsult: true, price: 35, img: "https://randomuser.me/api/portraits/women/44.jpg" },
  { id: 2, name: "Dr. Jean Martin", specialty: "Cardiologue", city: "Paris", phone: "01 45 22 11 33", teleconsult: true, price: 60, img: "https://randomuser.me/api/portraits/men/32.jpg" },
  { id: 3, name: "Dr. Sophie Bernard", specialty: "Dermatologue", city: "Lyon", phone: "04 72 10 20 30", teleconsult: true, img: "https://randomuser.me/api/portraits/women/68.jpg" },
  { id: 4, name: "Dr. Karim Benali", specialty: "Pédiatre", city: "Marseille", phone: "04 91 55 66 77", teleconsult: false, img: "https://randomuser.me/api/portraits/men/75.jpg" },
  { id: 5, name: "Dr. Claire Fontaine", specialty: "Ophtalmologue", city: "Bordeaux", phone: "05 56 44 33 22", teleconsult: true, img: "https://randomuser.me/api/portraits/women/12.jpg" },
  { id: 7, name: "Dr. Amina Chaouche", specialty: "Gynécologue", city: "Toulouse", phone: "05 61 22 33 44", teleconsult: true, img: "https://randomuser.me/api/portraits/women/90.jpg" },
  { id: 8, name: "Dr. Paul Durand", specialty: "Orthopédiste", city: "Nantes", phone: "02 40 55 66 77", teleconsult: false, img: "https://randomuser.me/api/portraits/men/20.jpg" },
];

const DoctorSearch = () => {
  const [activeTab, setActiveTab] = useState("specialty");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [selectedSymptom, setSelectedSymptom] = useState("");

  const specialties = [...new Set(doctors.map(d => d.specialty))];


  const filtered = doctors.filter((d) => {
    if (activeTab === "specialty") return selectedSpecialty ? d.specialty === selectedSpecialty : true;
    if (activeTab === "location") {
      const locationMatch = locationInput ? d.city.toLowerCase().includes(locationInput.toLowerCase()) : true;
      const specialtyMatch = selectedSpecialty ? d.specialty === selectedSpecialty : false;
      return locationMatch && specialtyMatch;
    }
    if (activeTab === "symptom") {
      if (!selectedSymptom) return true;
      return symptomMap[selectedSymptom] ? d.specialty === symptomMap[selectedSymptom] : true;
    }
    return true;
  });
  const notifsData = useContext(NotificationsContext);


  const tabs = [
    { id: "specialty", label: "Par spécialité", icon: "🩺" },
    { id: "location", label: "Par localisation", icon: "📍" },
    { id: "symptom", label: "Par symptôme", icon: "😷" }
  ];

  return (
    <div className="page-wrapper">
      <Header pageTitle="Votre santé en ligne" />

      <nav className="top-actions">
        <Link to="/" className="tab active">
          <span className="emoji-icon">📅</span>
          Réserver
        </Link>
        <Link to="/appointments" className="tab">
          <span className="emoji-icon">📌</span>
          Rendez-vous
        </Link>
        <Link to="/payments" className="tab">
          <span className="emoji-icon">💳</span>
          Paiements
        </Link>
        <Link to="/notifications" className="tab">
          <span className="emoji-icon">🔔</span>
          Notifications
        </Link>
        <Link to="/profile" className="tab">
          <span className="emoji-icon">👤</span>
          Profil
        </Link>
      </nav>

      <div className="card">
        <h1 className="card-title">Sélectionner un médecin</h1>
        <p className="card-subtitle">Recherchez par spécialité, localisation ou symptôme</p>

        <div className="tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "specialty" && (
          <>
            <p className="filter-label">Choisissez une spécialité</p>
            <div className="select-wrapper">
              <select value={selectedSpecialty} onChange={(e) => setSelectedSpecialty(e.target.value)}>
                <option value="">Toutes spécialités</option>
                {specialties.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <span className="select-arrow">⌄</span>
            </div>
          </>
        )}

        {activeTab === "location" && (
          <>
            <p className="filter-label">Spécialité + Ville</p>
            <div className="select-wrapper">
              <select value={selectedSpecialty} onChange={(e) => setSelectedSpecialty(e.target.value)}>
                <option value="">Choisir spécialité</option>
                {specialties.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <span className="select-arrow">⌄</span>
            </div>
            {selectedSpecialty && (
              <>
                <p className="filter-label">Ville</p>
                <input
                  className="text-input"
                  type="text"
                  placeholder="Paris, Lyon..."
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                />
              </>
            )}
            {!selectedSpecialty && <p className="hint">Choisissez spécialité d'abord</p>}
          </>
        )}

        {activeTab === "symptom" && (
          <>
            <p className="filter-label">Symptôme</p>
            <select className="text-input" onChange={(e) => setSelectedSymptom(e.target.value)}>
              <option value="">Sélectionner symptôme</option>
              <option value="maux de tête">Maux de tête</option>
              <option value="douleur thoracique">Douleur thoracique</option>
              <option value="eczéma">Eczéma</option>
              <option value="fièvre">Fièvre</option>
            </select>
          </>
        )}

        <p className="results-count">
          {filtered.length} médecin{filtered.length !== 1 ? "s" : ""} trouvé{filtered.length !== 1 ? "s" : ""}
        </p>

        <div className="doctors-grid">
          {filtered.length === 0 ? (
            <div className="empty">Aucun médecin trouvé</div>
          ) : (
            filtered.map((doc) => (
              <div key={doc.id} className="doctor-card">
                <div className="doctor-left">
                  <img src={doc.img} alt={doc.name} className="doctor-avatar" />
                </div>
                <div className="doctor-right">
                  <div className="doctor-info">
                    <span className="doctor-name">{doc.name}</span>
                    <span className="doctor-specialty">{doc.specialty}</span>
                    {doc.teleconsult && (
                      <span className="teleconsult-badge">Téléconsult {doc.price}€</span>
                    )}
                  </div>
                  <div className="doctor-meta">
                    <div className="meta-row"><span className="meta-icon">📍</span>{doc.city}</div>
                    <div className="meta-row"><span className="meta-icon">📞</span>{doc.phone}</div>
                  </div>
                  <Link to={`/doctor/${doc.id}`} className="btn-disponibilites">
                    Voir disponibilités
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorSearch;

