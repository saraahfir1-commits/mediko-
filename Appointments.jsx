

import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookingsContext } from './contexts/BookingsContext';
import { NotificationsContext } from './contexts/NotificationsContext';
import Header from './Header';
import "./DoctorSearch.css";

const Appointments = () => {
  const { getUpcoming, getPast, cancelBooking } = useContext(BookingsContext);
  const notifsData = useContext(NotificationsContext);
  const upcoming = getUpcoming();
  const past = getPast();

  const handleCancel = (bookingId) => {
    if (confirm("Confirmer l'annulation ?")) {
      cancelBooking(bookingId);
      notifsData.addNotification('RDV annulé ❌', 'Votre rendez-vous a été annulé');
    }
  };

  return (
    <div className="page-wrapper">
      <Header pageTitle="Mes rendez-vous" />

      <nav className="top-actions">
        <Link to="/" className="tab"><span className="emoji-icon">📅</span> Réserver</Link>
        <button className="tab active"><span className="emoji-icon">📌</span> Rendez-vous</button>
        <Link to="/payments" className="tab"><span className="emoji-icon">💳</span> Paiements</Link>
        <Link to="/notifications" className="tab"><span className="emoji-icon">🔔</span> Notifications</Link>
        <Link to="/profile" className="tab"><span className="emoji-icon">👤</span> Profil</Link>
      </nav>

      <div style={{marginTop: '20px', marginBottom: '40px', paddingLeft: '20px', paddingRight: '20px'}}>
        <main className="notifications-card" style={{minHeight: '600px'}}>
          <div className="notifications-card-header">
            <div>
              <h1 className="card-title">Mes rendez-vous</h1>
              <p className="card-subtitle">Consultez et gérez tous vos rendez-vous médicaux</p>
            </div>
          </div>

          <div>
            {upcoming.length === 0 && past.length === 0 ? (
              <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingBottom: '40px'}}>
                <div style={{textAlign: 'center'}}>
                  <div style={{fontSize: '80px', marginBottom: '32px', opacity: 0.4}}>📅</div>
                  <h2 style={{fontSize: '24px', fontWeight: 600, color: '#1f2937', margin: '0 0 12px 0'}}>Aucun rendez-vous</h2>
                  <p style={{color: '#6b7280', fontSize: '15px', margin: 0, lineHeight: 1.5}}>Vous n'avez pas encore de rendez-vous planifié</p>
                </div>
              </div>
            ) : (
              <>
                {upcoming.length > 0 && (
                  <>
                    <h2 style={{margin: '32px 0 16px 0', fontSize: '20px'}}>Rendez-vous à venir</h2>
                    {upcoming.map(booking => (
                      <article key={booking.id} className={`notification-entry ${booking.consultationType === 'teleconsult' ? 'teleconsult-card' : 'presential-card'}`}>
                      <div className="notification-entry-content">
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', gap: '12px', flexWrap: 'wrap'}}>
                          <div style={{display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap'}}>
                            <div>
                              <h4 style={{margin: '0 0 4px 0', fontSize: '16px', fontWeight: 600}}>{booking.doctorName}</h4>
                              <p style={{margin: 0, fontSize: '14px', color: '#9ca3af'}}>{booking.specialty}</p>
                            </div>
                            {booking.consultationType === 'teleconsult' && (
                              <span className={`notification-entry-tag ${booking.consultationType === 'teleconsult' ? 'teleconsult-tag' : 'presential-tag'}`}>
                                Téléconsultation
                              </span>
                            )}
                          </div>
                          <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center'}}>
                            <button className="notification-action-button" title="Actualiser" style={{background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', padding: '4px'}}>🔄</button>
                            <button className="notification-action-delete" type="button" onClick={() => handleCancel(booking.id)} title="Annuler" style={{background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', padding: '4px', color: '#ef4444'}}>🗑️</button>
                          </div>
                        </div>

                        <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '14px', marginTop: '14px'}}>
                          <div style={{display: 'grid', gap: '10px'}}>
                            <div style={{display: 'flex', alignItems: 'center', gap: '10px', color: '#475569'}}><span>📅</span><span>{booking.date}</span></div>
                            <div style={{display: 'flex', alignItems: 'center', gap: '10px', color: '#475569'}}><span>🕒</span><span>{booking.slot}</span></div>
                            <div style={{display: 'flex', alignItems: 'center', gap: '10px', color: '#475569'}}><span>📍</span><span>{booking.location || (booking.consultationType === 'teleconsult' ? 'Consultation à distance' : '15 Rue de la République')}</span></div>
                          </div>
                          <div style={{display: 'grid', gap: '10px'}}>
                            <div style={{display: 'flex', alignItems: 'center', gap: '10px', color: '#1f2937', fontWeight: 600}}><span>👤</span><span>{booking.contactName || 'Nom patient'}</span></div>
                            <div style={{display: 'flex', alignItems: 'center', gap: '10px', color: '#475569'}}><span>✉️</span><span>{booking.contactEmail || 'Aucun email'}</span></div>
                            <div style={{display: 'flex', alignItems: 'center', gap: '10px', color: '#475569'}}><span>📞</span><span>{booking.contactPhone || 'Aucun téléphone'}</span></div>
                          </div>
                        </div>

                        <div style={{marginTop: '18px', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexWrap: 'wrap', gap: '12px'}}>
                          {(booking.paymentMethod || booking.consultationType === 'teleconsult') && (
                            <span className={`payment-pill ${booking.paymentMethod ? 'paid-pill' : 'pending-pill'}`}>
                              {booking.paymentMethod ? `Payé • ${booking.price || 0} €` : 'En attente de paiement'}
                            </span>
                          )}
                        </div>
                        {booking.consultationType === 'teleconsult' && (
                          <div className="teleconsult-note" style={{marginTop: '14px'}}>
                            <span>💬</span> Le lien de visioconférence sera disponible 30 minutes avant le rendez-vous.
                          </div>
                        )}
                      </div>
                    </article>
                ))}
                  </>
                )}
                {upcoming.length === 0 && past.length > 0 && (
                  <>
                    <h2 style={{margin: '32px 0 16px 0', fontSize: '20px', color: '#000000'}}>Rendez-vous à venir</h2>
                    {past.map(booking => (
                      <article key={booking.id} className={`notification-entry ${booking.consultationType === 'teleconsult' ? 'teleconsult-card' : 'presential-card'}`}>
                      <div className="notification-entry-content">
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', gap: '12px', flexWrap: 'wrap'}}>
                          <div style={{display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap'}}>
                            <div>
                              <h4 style={{margin: '0 0 4px 0', fontSize: '16px', fontWeight: 600}}>{booking.doctorName}</h4>
                              <p style={{margin: 0, fontSize: '14px', color: '#9ca3af'}}>{booking.specialty}</p>
                            </div>
                            {booking.consultationType === 'teleconsult' && (
                              <span className={`notification-entry-tag ${booking.consultationType === 'teleconsult' ? 'teleconsult-tag' : 'presential-tag'}`}>
                                Téléconsultation
                              </span>
                            )}
                          </div>
                          <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center'}}>
                            <button className="notification-action-button" title="Actualiser" style={{background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', padding: '4px'}}>🔄</button>
                            <button className="notification-action-delete" type="button" onClick={() => handleCancel(booking.id)} title="Annuler" style={{background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', padding: '4px', color: '#ef4444'}}>🗑️</button>
                          </div>
                        </div>

                        <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '14px', marginTop: '14px'}}>
                          <div style={{display: 'grid', gap: '10px'}}>
                            <div style={{display: 'flex', alignItems: 'center', gap: '10px', color: '#475569'}}><span>📅</span><span>{booking.date}</span></div>
                            <div style={{display: 'flex', alignItems: 'center', gap: '10px', color: '#475569'}}><span>🕒</span><span>{booking.slot}</span></div>
                            <div style={{display: 'flex', alignItems: 'center', gap: '10px', color: '#475569'}}><span>📍</span><span>{booking.location || (booking.consultationType === 'teleconsult' ? 'Consultation à distance' : '15 Rue de la République')}</span></div>
                          </div>
                          <div style={{display: 'grid', gap: '10px'}}>
                            <div style={{display: 'flex', alignItems: 'center', gap: '10px', color: '#1f2937', fontWeight: 600}}><span>👤</span><span>{booking.contactName || 'Nom patient'}</span></div>
                            <div style={{display: 'flex', alignItems: 'center', gap: '10px', color: '#475569'}}><span>✉️</span><span>{booking.contactEmail || 'Aucun email'}</span></div>
                            <div style={{display: 'flex', alignItems: 'center', gap: '10px', color: '#475569'}}><span>📞</span><span>{booking.contactPhone || 'Aucun téléphone'}</span></div>
                          </div>
                        </div>

                        <div style={{marginTop: '18px', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexWrap: 'wrap', gap: '12px'}}>
                          <span className={`payment-pill ${booking.paymentMethod ? 'paid-pill' : 'pending-pill'}`}>
                            {booking.paymentMethod ? `Payé • ${booking.price || 0} €` : 'En attente de paiement'}
                          </span>
                        </div>
                        {booking.consultationType === 'teleconsult' && (
                          <div className="teleconsult-note" style={{marginTop: '14px'}}>
                            <span>💬</span> Le lien de visioconférence sera disponible 30 minutes avant le rendez-vous.
                          </div>
                        )}
                      </div>
                    </article>
                    ))}
                  </>
                )}
              </>
            )}
          </div>
        </main>
      </div>


    </div>
  );
};

export default Appointments;
