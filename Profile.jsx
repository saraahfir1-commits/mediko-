

import { useContext, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from './contexts/UserContext';
import { BookingsContext } from './contexts/BookingsContext';
import "./DoctorSearch.css";
import { NotificationsContext } from './contexts/NotificationsContext';
import Header from './Header';

const Profile = () => {
  const { user, updateUser } = useContext(UserContext);
  const { getUpcoming, getPast } = useContext(BookingsContext);
  const notifsData = useContext(NotificationsContext);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [editing, setEditing] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone || '');
  const [age, setAge] = useState(user.age || '');
  const [address, setAddress] = useState(user.address || '');
  const [city, setCity] = useState(user.city || '');
  const [gender, setGender] = useState(user.gender || '');
  const [bloodType, setBloodType] = useState(user.bloodType || '');
  const [height, setHeight] = useState(user.height || '');
  const [weight, setWeight] = useState(user.weight || '');
  const [emergencyName, setEmergencyName] = useState(user.emergencyName || '');
  const [emergencyPhone, setEmergencyPhone] = useState(user.emergencyPhone || '');
  const [photo, setPhoto] = useState(null);

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhoto(URL.createObjectURL(file));
  };

  const handleSave = () => {
    updateUser({
      name,
      email,
      phone,
      age,
      address,
      city,
      gender,
      bloodType,
      height,
      weight,
      emergencyName,
      emergencyPhone,
    });
    setEditing(false);
    notifsData.addNotification('Profil mis à jour ✅', 'Vos informations ont été sauvegardées');
  };

  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraOpen(true);
      setIsCameraReady(false);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        // Démarrer la lecture immédiatement
        videoRef.current.play().then(() => {
          setIsCameraReady(true);
        }).catch(err => {
          console.error('Erreur play video:', err);
          alert('Erreur lors du démarrage de la caméra');
        });
      }
    } catch (err) {
      console.error('Erreur accès caméra:', err);
      alert('Impossible d\'accéder à la caméra');
    }
  };

  const capturePhoto = () => {
    if (!isCameraReady) {
      alert('La caméra n\'est pas encore prête. Veuillez attendre un instant.');
      return;
    }
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      // Mettre les dimensions du canvas aux dimensions du vidéo
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Flip horizontalement pour mirror la caméra frontale
      context.translate(canvas.width, 0);
      context.scale(-1, 1);
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const photoData = canvas.toDataURL('image/jpeg', 0.9);
      setPhoto(photoData);
      closeCamera();
    }
  };

  const closeCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    setCameraOpen(false);
    setIsCameraReady(false);
  };

  return (
    <div className="page-wrapper profile-page">
      <Header pageTitle="Mon profil" />
      <div className="profile-header-banner-new">
        <div className="profile-banner-left">
          <div className="profile-avatar-banner">
            {photo ? <img src={photo} alt="Photo de profil" /> : '👤'}
          </div>
          <div className="profile-banner-info">
            <h1>{user.name}</h1>
            <p className="profile-file-number">Dossier #{Math.random().toString().slice(2, 8)}</p>
          </div>
        </div>
        <div className="profile-banner-actions">
          <button className="btn-banner-action" onClick={() => setEditing(true)}>✏️ Modifier Profil</button>
          <div className="back-link-container">
            <Link to="/" className="back-link-profile">← Retour à l'accueil</Link>
          </div>
        </div>
      </div>

      {cameraOpen && (
        <div className="camera-modal-overlay" onClick={closeCamera}>
          <div className="camera-modal" onClick={(e) => e.stopPropagation()}>
            <div className="camera-header">
              <h2>📷 Prendre une photo</h2>
              <button className="camera-close" onClick={closeCamera}>✕</button>
            </div>
            <div className="camera-preview">
              <video ref={videoRef} autoPlay playsInline></video>
              <canvas ref={canvasRef} width="400" height="400" style={{display: 'none'}}></canvas>
            </div>
            <div className="camera-actions">
              <button className="btn-capture" onClick={capturePhoto} disabled={!isCameraReady}>
                📸 {isCameraReady ? 'Capturer' : 'Chargement...'}
              </button>
              <button className="btn-cancel-camera" onClick={closeCamera}>Annuler</button>
            </div>
          </div>
        </div>
      )}

      {editing && (
        <div className="profile-modal-overlay" onClick={() => setEditing(false)}>
          <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
            <div className="profile-modal-photo-section">
              <div className="profile-modal-avatar">
                {photo ? <img src={photo} alt="Photo" /> : '👤'}
              </div>
              <div className="profile-photo-options">
                <label className="photo-option photo-upload">
                  📁 Choisir fichier
                  <input type="file" accept="image/*" onChange={handlePhotoChange} />
                </label>
                <button className="photo-option photo-capture" onClick={openCamera}>
                  📷 Prendre photo
                </button>
              </div>
            </div>
            <h2>Modifier vos informations</h2>
            <div className="profile-form-grid">
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nom / Prénom" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Téléphone" />
              <input type="text" value={age} onChange={(e) => setAge(e.target.value)} placeholder="Âge" />
              <input type="text" value={gender} onChange={(e) => setGender(e.target.value)} placeholder="Genre" />
              <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Adresse" />
              <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Ville / CP" />
              <input type="text" value={bloodType} onChange={(e) => setBloodType(e.target.value)} placeholder="Groupe sanguin" />
              <input type="text" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="Taille" />
              <input type="text" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="Poids" />
              <input type="text" value={emergencyName} onChange={(e) => setEmergencyName(e.target.value)} placeholder="Contact urgence" />
              <input type="tel" value={emergencyPhone} onChange={(e) => setEmergencyPhone(e.target.value)} placeholder="Tél. urgence" />
            </div>
            <div className="profile-modal-actions">
              <button className="btn-disponibilites" onClick={handleSave}>Sauvegarder</button>
              <button className="btn-cancel" onClick={() => {
                setEditing(false);
                setName(user.name);
                setEmail(user.email);
                setPhone(user.phone || '');
                setAge(user.age || '');
                setAddress(user.address || '');
                setCity(user.city || '');
                setGender(user.gender || '');
                setBloodType(user.bloodType || '');
                setHeight(user.height || '');
                setWeight(user.weight || '');
                setEmergencyName(user.emergencyName || '');
                setEmergencyPhone(user.emergencyPhone || '');
              }}>Annuler</button>
            </div>
          </div>
        </div>
      )}

      <div className="profile-grid-sections">
        <div className="profile-section-left">
          <div className="profile-section-card">
            <h3>📋 Informations Personnelles</h3>
            <div className="profile-info-item">
              <span className="info-label">Date de naissance:</span>
              <span className="info-value">{user.age} ans</span>
            </div>
            <div className="profile-info-item">
              <span className="info-label">Sexe :</span>
              <span className="info-value" style={{textTransform: 'capitalize'}}>{user.gender}</span>
            </div>
            <div className="profile-info-item">
              <span className="info-label">Téléphone :</span>
              <span className="info-value">{user.phone}</span>
            </div>
            <div className="profile-info-item">
              <span className="info-label">Adresse :</span>
              <span className="info-value">{user.address}, {user.city}</span>
            </div>
          </div>

          <div className="profile-section-card">
            <h3>🏥 Contact d'Urgence</h3>
            <div className="profile-info-item">
              <span className="info-label">Nom :</span>
              <span className="info-value">{user.emergencyName || 'Non défini'}</span>
            </div>
            <div className="profile-info-item">
              <span className="info-label">Téléphone :</span>
              <span className="info-value">{user.emergencyPhone || 'Non défini'}</span>
            </div>
          </div>
        </div>

        <div className="profile-section-middle">
          <div className="profile-section-card full-height">
            <h3>📅 Consultations Récentes</h3>
            <div className="consultations-list">
              {getPast().slice(0, 3).map(booking => (
                <div key={booking.id} className="consultation-item">
                  <div className="consultation-date">📅 {booking.date}</div>
                  <div className="consultation-doctor">{booking.doctorName}</div>
                  <div className="consultation-note">{booking.slot}</div>
                </div>
              ))}
              {getPast().length === 0 && (
                <div style={{padding: '20px', textAlign: 'center', color: '#999'}}>
                  Aucune consultation
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="profile-section-right">
          <div className="profile-section-card">
            <h3>🩺 Données Médicales</h3>
            <div className="medical-info-grid">
              <div className="medical-param">
                <span className="param-label">Groupe sanguin</span>
                <span className="param-value">{user.bloodType || 'Non défini'}</span>
              </div>
              <div className="medical-param">
                <span className="param-label">Taille</span>
                <span className="param-value">{user.height || '-'}</span>
              </div>
              <div className="medical-param">
                <span className="param-label">Poids</span>
                <span className="param-value">{user.weight || '-'}</span>
              </div>
            </div>
          </div>

          <div className="profile-section-card">
            <h3>⚕️ Historique Médical</h3>
            <div className="medical-item">
              <strong>Allergies:</strong>
              <span className="allergy-badge">Non renseignées</span>
            </div>
            <div className="medical-item">
              <strong>Maladies Chroniques:</strong>
              <span>Non renseignées</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

