import { useState, useContext, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

import './DoctorAvailability.css';
import { NotificationsContext } from './contexts/NotificationsContext';
import UserContext from './contexts/UserContext';
import { useBookings } from './contexts/BookingsContext';
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

const dates = [
  { day: 'mer. 15 avr.', date: '15/04', slotsTeleconsult: ['09:00', '10:00', '12:00', '14:00', '15:30', '17:00', '18:30', '20:00'], slotsPresential: ['09:00', '10:30', '14:00', '14:30', '15:00', '17:30', '18:00', '19:00'], count: 8 },
  { day: 'jeu. 16 avr.', date: '16/04', slotsTeleconsult: ['10:00', '11:00', '15:00', '16:30', '18:00'], slotsPresential: ['10:30', '11:30', '14:00', '15:00'], count: 10 },
  { day: 'dim. 19 avr.', date: '19/04', slotsTeleconsult: ['09:00', '13:00', '15:00', '17:00', '20:00'], slotsPresential: ['09:30', '13:30', '15:30'], count: 10 },
];

const DoctorAvailability = () => {
  const notifsData = useContext(NotificationsContext);
  const { id } = useParams();
  const doctor = doctors.find(d => d.id === parseInt(id)) || doctors[0];
  const { user } = useContext(UserContext);

  const [consultationType, setConsultationType] = useState(doctor.teleconsult ? 'teleconsult' : 'presential');
  const [selectedDate, setSelectedDate] = useState(dates[0]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showConfirmationForm, setShowConfirmationForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const { addBooking } = useBookings();
  const navigate = useNavigate();

  const formatDateFull = (dayShort, dateStr) => {
    const dayMap = {
      'mer.': 'Mercredi',
      'jeu.': 'Jeudi',
      'ven.': 'Vendredi',
      'sam.': 'Samedi',
      'dim.': 'Dimanche',
      'lun.': 'Lundi',
      'mar.': 'Mardi'
    };
    const monthMap = {
      '01': 'janvier', '02': 'février', '03': 'mars', '04': 'avril',
      '05': 'mai', '06': 'juin', '07': 'juillet', '08': 'août',
      '09': 'septembre', '10': 'octobre', '11': 'novembre', '12': 'décembre'
    };
    const [day, date] = dayShort.split(' ');
    const [dayNum, month] = dateStr.split('/');
    const dayFull = dayMap[day] || day;
    const monthFull = monthMap[month] || month;
    return `${dayFull} ${dayNum} ${monthFull} 2026`;
  };

  useEffect(() => {
    setConsultationType(doctor.teleconsult ? 'teleconsult' : 'presential');
    setSelectedDate(dates[0]);
    setSelectedSlot(null);
  }, [doctor]);

  const infoText = consultationType === 'teleconsult'
    ? 'Téléconsultation via appel vidéo sécurisé. Le lien vous sera envoyé après la réservation.'
    : `Consultation au cabinet médical : 15 Rue de la République, 75001 ${doctor.city}`;

  const handleBook = () => {
    if (selectedDate && selectedSlot) {
      setShowConfirmationForm(true);
      setShowPaymentForm(false);
    } else {
      alert('Veuillez sélectionner une date et un créneau.');
    }
  };

  const handlePayment = () => {
    if (!selectedPaymentMethod) {
      alert('Veuillez choisir une méthode de paiement.');
      return;
    }

    if (!cardNumber.trim() || !cardHolder.trim() || !expiryDate.trim() || !cvv.trim()) {
      alert('Veuillez remplir tous les champs de la carte.');
      return;
    }

    addBooking({
      doctorId: doctor.id,
      doctorName: doctor.name,
      specialty: doctor.specialty,
      date: selectedDate.date,
      slot: selectedSlot,
      teleconsult: consultationType === 'teleconsult',
      consultationType,
      location: consultationType === 'presential' ? `15 Rue de la République, 75001 ${doctor.city}` : 'Consultation à distance',
      price: doctor.price || 0,
      city: doctor.city,
      contactName,
      contactEmail,
      contactPhone,
      paymentMethod: selectedPaymentMethod
    });

    notifsData.addNotification(
      'Rdv confirmé ✅',
      `Votre rendez-vous avec ${doctor.name} le ${selectedDate.date} à ${selectedSlot}`
    );
    navigate('/appointments');
  };

  const handleFinalizeBooking = () => {
    if (consultationType === 'teleconsult') {
      if (!contactName.trim() || !contactEmail.trim() || !contactPhone.trim()) {
        alert('Veuillez renseigner votre nom, email et téléphone.');
        return;
      }
      setShowConfirmationForm(false);
      setShowPaymentForm(true);
      return;
    }

    addBooking({
      doctorId: doctor.id,
      doctorName: doctor.name,
      specialty: doctor.specialty,
      date: selectedDate.date,
      slot: selectedSlot,
      teleconsult: consultationType === 'teleconsult',
      consultationType,
      location: consultationType === 'presential' ? `15 Rue de la République, 75001 ${doctor.city}` : 'Consultation à distance',
      price: doctor.price || 0,
      city: doctor.city,
      contactName,
      contactEmail,
      contactPhone
    });

    notifsData.addNotification(
      'Rdv confirmé ✅',
      `Votre rendez-vous avec ${doctor.name} le ${selectedDate.date} à ${selectedSlot}`
    );
    navigate('/appointments');
  };

  return (
    <div className="page-wrapper availability-page">
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

      <div className="page-content">
        {!showConfirmationForm && !showPaymentForm && (
          <div className="page-title-block">
            <h1>Choisir un créneau</h1>
            <p>Sélectionnez une date et une heure disponibles</p>
          </div>
        )}

        <div className="availability-card">
          {showConfirmationForm && (
            <div className="card-header-inline">
              <h1>Vos informations</h1>
              <p>Complétez vos informations pour finaliser la réservation</p>
            </div>
          )}
          {!showConfirmationForm && !showPaymentForm && (
            <Link to="/" className="back-link">← Retour à la liste</Link>
          )}

          {!showConfirmationForm && !showPaymentForm && (
            <>
              <div className="availability-doctor-top">
                <div>
                  <h2>{doctor.name}</h2>
                  <p className="doctor-subtitle">{doctor.specialty} • {doctor.city}</p>
                </div>
                <div className="doctor-price-badge">
                  {consultationType === 'teleconsult' ? `Téléconsultation ${doctor.price}€` : 'Présentiel'}
                </div>
              </div>

              <div className="consultation-panel">
                <h3>Type de consultation</h3>
                <div className="consultation-options">
                  <button
                    className={`consultation-tab ${consultationType === 'presential' ? 'active' : ''}`}
                    onClick={() => setConsultationType('presential')}
                  >
                    Présentiel
                  </button>
                  <button
                    className={`consultation-tab ${consultationType === 'teleconsult' ? 'active' : ''}`}
                    onClick={() => setConsultationType('teleconsult')}
                    disabled={!doctor.teleconsult}
                  >
                    Téléconsultation
                  </button>
                </div>
                <p className="consultation-note">{infoText}</p>
              </div>
            </>
          )}

          <div className="availability-container">
            {showPaymentForm && (
              <div className="final-confirmation-content">
                <button
                  type="button"
                  className="confirmation-back-link"
                  onClick={() => {
                    setShowPaymentForm(false);
                    setShowConfirmationForm(true);
                  }}
                >
                  ← Retour
                </button>

                <div className="confirmation-card" style={{maxWidth: '100%'}}>
                  <h2 style={{margin: '0 0 8px 0', fontSize: '18px', fontWeight: 700, color: '#111827'}}>Paiement sécurisé</h2>
                  <p style={{margin: '0 0 24px 0', color: '#6b7280', fontSize: '14px'}}>Procédez au paiement sécurisé de votre téléconsultation</p>

                  <div style={{background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', padding: '20px', marginBottom: '24px'}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px'}}>
                      <span style={{fontSize: '20px'}}>🔒</span>
                      <div>
                        <div style={{fontWeight: 700, fontSize: '15px', color: '#111827'}}>Paiement sécurisé</div>
                        <div style={{fontSize: '13px', color: '#6b7280'}}>Toutes les transactions sont sécurisées et cryptées</div>
                      </div>
                    </div>
                    <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', fontSize: '13px'}}>
                      <div>
                        <div style={{color: '#6b7280', marginBottom: '4px'}}>Médecin:</div>
                        <div style={{fontWeight: 600, color: '#111827'}}>{doctor.name}</div>
                      </div>
                      <div style={{textAlign: 'right'}}>
                        <div style={{color: '#6b7280', marginBottom: '4px'}}>Date:</div>
                        <div style={{fontWeight: 600, color: '#111827'}}>{formatDateFull(selectedDate.day, selectedDate.date)} à {selectedSlot}</div>
                      </div>
                      <div>
                        <div style={{color: '#6b7280', marginBottom: '4px'}}>Type:</div>
                        <div style={{fontWeight: 600, color: '#111827'}}>Téléconsultation</div>
                      </div>
                      <div style={{textAlign: 'right'}}>
                        <div style={{color: '#6b7280', marginBottom: '4px'}}>Total à payer:</div>
                        <div style={{fontWeight: 700, fontSize: '16px', color: '#2563eb'}}>{doctor.price || 0}€</div>
                      </div>
                    </div>
                  </div>

                  <div style={{background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', padding: '20px', marginBottom: '24px'}}>
                    <h3 style={{margin: '0 0 16px 0', fontSize: '15px', fontWeight: 700, color: '#000000'}}>Méthode de paiement</h3>
                    <div style={{display: 'grid', gap: '12px', marginBottom: '0'}}>
                      <div
                        onClick={() => setSelectedPaymentMethod('card')}
                        style={{
                          border: selectedPaymentMethod === 'card' ? '2px solid #2563eb' : '2px solid #e5e7eb',
                          borderRadius: '8px',
                          padding: '16px',
                          cursor: 'pointer',
                          background: '#fff'
                        }}
                      >
                        <div style={{display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 600, color: '#111827'}}>
                          <span style={{fontSize: '18px'}}>💳</span> Carte bancaire
                        </div>
                      </div>
                      <div
                        onClick={() => setSelectedPaymentMethod('dahabia')}
                        style={{
                          border: selectedPaymentMethod === 'dahabia' ? '2px solid #2563eb' : '1px solid #e5e7eb',
                          borderRadius: '8px',
                          padding: '16px',
                          cursor: 'pointer',
                          background: selectedPaymentMethod === 'dahabia' ? '#ffffff' : '#f9fafb',
                          opacity: selectedPaymentMethod === 'dahabia' ? 1 : 0.6
                        }}
                      >
                        <div style={{display: 'flex', alignItems: 'center', gap: '12px', color: '#111827', fontWeight: 600}}>
                          <span style={{fontSize: '18px'}}>$</span> Carte el dahabia
                        </div>
                      </div>
                    </div>
                  </div>

                  {selectedPaymentMethod && (
                    <>
                      <h3 style={{margin: '0 0 16px 0', fontSize: '14px', fontWeight: 700, color: '#111827'}}>
                        {selectedPaymentMethod === 'card' ? 'Informations de carte bancaire' : 'Informations de carte el dahabia'}
                      </h3>
                      <div style={{display: 'grid', gap: '16px', marginBottom: '24px'}}>
                        <div>
                          <label style={{display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 700, color: '#111827'}}>
                            {selectedPaymentMethod === 'card' ? 'Numéro de carte' : 'Numéro de carte el dahabia'}
                          </label>
                          <input
                            type="text"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value.replace(/\s/g, '').slice(0, 16))}
                            placeholder={selectedPaymentMethod === 'card' ? '1234 5678 9012 3456' : 'XXXX XXXX XXXX XXXX'}
                            style={{width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', background: '#ffffff', color: '#111827', boxShadow: 'inset 0 1px 2px rgba(15, 23, 42, 0.06)'}}
                          />
                        </div>
                        <div>
                          <label style={{display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 700, color: '#111827'}}>Nom du titulaire</label>
                          <input
                            type="text"
                            value={cardHolder}
                            onChange={(e) => setCardHolder(e.target.value)}
                            placeholder="Jean Dupont"
                            style={{width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', background: '#ffffff', color: '#111827', boxShadow: 'inset 0 1px 2px rgba(15, 23, 42, 0.06)'}}
                          />
                        </div>
                        <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px'}}>
                          <div>
                            <label style={{display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 700, color: '#111827'}}>Date d'expiration</label>
                            <input
                              type="text"
                              value={expiryDate}
                              onChange={(e) => setExpiryDate(e.target.value)}
                              placeholder="MM/AA"
                              style={{width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', background: '#ffffff', color: '#111827', boxShadow: 'inset 0 1px 2px rgba(15, 23, 42, 0.06)'}}
                            />
                          </div>
                          <div>
                            <label style={{display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 700, color: '#111827'}}>CVV</label>
                            <input
                              type="text"
                              value={cvv}
                              onChange={(e) => setCvv(e.target.value.slice(0, 3))}
                              placeholder="123"
                              style={{width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', background: '#ffffff', color: '#111827', boxShadow: 'inset 0 1px 2px rgba(15, 23, 42, 0.06)'}}
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px'}}>
                    <button
                      type="button"
                      onClick={() => {
                        setShowPaymentForm(false);
                        setShowConfirmationForm(true);
                      }}
                      style={{padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', background: '#fff', color: '#111827', fontSize: '14px', fontWeight: 600, cursor: 'pointer'}}
                    >
                      Retour
                    </button>
                    <button
                      type="button"
                      onClick={handlePayment}
                      style={{padding: '12px', border: 'none', borderRadius: '8px', background: '#000', color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'}}
                    >
                      ✓ Payer maintenant{doctor.price ? ` • ${doctor.price}€` : ''}
                    </button>
                  </div>
                  <p style={{textAlign: 'center', margin: '16px 0 0 0', fontSize: '12px', color: '#6b7280'}}>
                    🔒 Paiement 100% sécurisé avec cryptage SSL
                  </p>
                </div>
              </div>
            )}

            {showConfirmationForm && !showPaymentForm && (
              <div className="final-confirmation-content">
                <button
                  type="button"
                  className="confirmation-back-link"
                  onClick={() => setShowConfirmationForm(false)}
                >
                  ← Retour
                </button>

                <div className="confirmation-card">
                  <div className="confirmation-card-header">
                    <h3>Confirmer votre rendez-vous</h3>
                    <p>Veuillez remplir vos informations pour finaliser la réservation</p>
                  </div>

                  <div className="confirmation-summary-card">
                    <div className="summary-line">
                      <span className="summary-icon">{consultationType === 'presential' ? '📍' : '📹'}</span>
                      <span className="summary-text">{consultationType === 'presential' ? 'Consultation en présentiel' : 'Téléconsultation'}</span>
                    </div>
                    <div className="summary-row"><span>Médecin</span> {doctor.name}</div>
                    <div className="summary-row"><span>Spécialité</span> {doctor.specialty}</div>
                    <div className="summary-row"><span>Lieu</span> {consultationType === 'presential' ? `15 Rue de la République, 75001 ${doctor.city}` : 'Consultation à distance'}</div>
                    <div className="summary-row"><span>Date</span> {formatDateFull(selectedDate.day, selectedDate.date)}</div>
                    <div className="summary-row"><span>Heure</span> {selectedSlot}</div>
                  </div>

                  <div className="confirmation-inputs">
                    <div className="field-group">
                      <div className="field-label"><span className="label-icon">👤</span> Nom complet</div>
                      <input type="text" value={contactName} onChange={(e) => setContactName(e.target.value)} placeholder="Jean Dupont" />
                    </div>
                    <div className="field-group">
                      <div className="field-label"><span className="label-icon">✉️</span> Email</div>
                      <input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="jean.dupont@example.com" />
                    </div>
                    <div className="field-group">
                      <div className="field-label"><span className="label-icon">📞</span> Téléphone</div>
                      <input type="tel" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} placeholder="06 12 34 56 78" />
                    </div>
                  </div>

                  <button
                    className="confirm-btn finalize-confirm-btn"
                    onClick={handleFinalizeBooking}
                    type="button"
                    disabled={!contactName.trim() || !contactEmail.trim() || !contactPhone.trim()}
                  >
                    Confirmer le rendez-vous
                  </button>
                </div>
              </div>
            )}

            {!showPaymentForm && !showConfirmationForm && (
              <div className="availability-grid">
                <div className="dates-section">
                  <div className="section-header">📅 Sélectionnez une date</div>
                  <div className="dates-list">
                    {dates.map((dateObj) => (
                      <div
                        key={dateObj.date}
                        className={`date-card ${selectedDate === dateObj ? 'active' : ''}`}
                        onClick={() => { setSelectedDate(dateObj); setSelectedSlot(null); }}
                      >
                        <span className="date-day">{dateObj.day}</span>
                        <span className="date-count">{dateObj.count} créneaux</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="slots-section">
                  <div className="section-header">🕒 Créneaux disponibles</div>
                  <div className="slots-container">
                    <div className="slots-panel">
                      <div className="time-slots-grid">
                        {(consultationType === 'teleconsult' ? selectedDate.slotsTeleconsult : selectedDate.slotsPresential).map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            className={`time-slot ${selectedSlot === slot ? 'time-slot-active' : ''}`}
                            onClick={() => setSelectedSlot(slot)}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                    {selectedSlot && (
                      <div className="light-blue-card">
                        <div className="confirmation-content">
                          <div className="confirmation-icon-type">
                            {consultationType === 'presential' ? '🏥 Présentiel' : '📹 Téléconsultation'}
                          </div>
                          <div className="confirmation-datetime">
                            {formatDateFull(selectedDate.day, selectedDate.date)} à {selectedSlot}
                          </div>
                        </div>
                        <button 
                          className="confirm-btn" 
                          onClick={handleBook}
                          type="button"
                        >
                          Confirmer
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default DoctorAvailability;

