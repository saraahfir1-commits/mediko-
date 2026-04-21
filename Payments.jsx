
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { BookingsContext } from './contexts/BookingsContext';
import Header from './Header';
import "./DoctorSearch.css";

const Payments = () => {
  const { getPast } = useContext(BookingsContext);

  const totalSpent = getPast().reduce((sum, b) => sum + (b.price || 0), 0).toFixed(2);
  const paidBookings = getPast().filter(b => b.price && b.paymentMethod);

  const downloadReceipt = (bookingId) => {
    alert(`Téléchargement du reçu pour le paiement ${bookingId}`);
  };

  return (
    <div className="page-wrapper">
      <Header pageTitle="Mes paiements" />

      <nav className="top-actions">
        <Link to="/" className="tab"><span className="emoji-icon">📅</span> Réserver</Link>
        <Link to="/appointments" className="tab"><span className="emoji-icon">📌</span> Rendez-vous</Link>
        <button className="tab active"><span className="emoji-icon">💳</span> Paiements</button>
        <Link to="/notifications" className="tab"><span className="emoji-icon">🔔</span> Notifications</Link>
        <Link to="/profile" className="tab"><span className="emoji-icon">👤</span> Profil</Link>
      </nav>

      <div style={{marginTop: '20px', marginBottom: '40px', paddingLeft: '20px', paddingRight: '20px'}}>
        <main className="notifications-card" style={{minHeight: '600px'}}>
          <div className="notifications-card-header">
            <div>
              <h1 className="card-title">Historique des paiements</h1>
              <p className="card-subtitle">Consultez toutes vos transactions et téléchargez vos reçus</p>
            </div>
          </div>

          {paidBookings.length === 0 ? (
            <div className="empty" style={{textAlign: 'center', padding: '60px 20px'}}>
              <div style={{fontSize: '80px', marginBottom: '32px', opacity: 0.4}}>💳</div>
              <h2 style={{fontSize: '24px', fontWeight: 600, color: '#1f2937', margin: '0 0 12px 0'}}>Aucun paiement</h2>
              <p style={{color: '#6b7280', fontSize: '15px', margin: 0, lineHeight: 1.5}}>Votre historique de paiements apparaîtra ici</p>
            </div>
          ) : (
            <>
              {/* Total des paiements */}
              <div style={{background: '#eff6ff', borderRadius: '20px', padding: '24px', marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div>
                  <div style={{color: '#6b7280', fontSize: '14px', marginBottom: '8px'}}>Total des paiements</div>
                  <div style={{fontSize: '36px', fontWeight: 700, color: '#2563eb'}}>{totalSpent} €</div>
                </div>
                <div style={{fontSize: '48px', color: '#2563eb'}}>✅</div>
              </div>

              {/* Historique des transactions */}
              <h2 style={{margin: '0 0 16px 0', fontSize: '20px', fontWeight: 600}}>Historique des transactions</h2>
              {paidBookings.map(booking => (
                <div key={booking.id} style={{background: '#ffffff', borderRadius: '16px', border: '1px solid #e5e7eb', padding: '20px', marginBottom: '16px'}}>
                  {/* Header avec statut */}
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px'}}>
                    <div style={{display: 'flex', gap: '12px', alignItems: 'flex-start', flex: 1}}>
                      <div style={{fontSize: '24px'}}>💳</div>
                      <div>
                        <div style={{fontSize: '16px', fontWeight: 600, marginBottom: '4px'}}>Paiement par carte</div>
                        <div style={{fontSize: '14px', color: '#6b7280'}}>Carte •••• {booking.cardLast4 || '6543'}</div>
                      </div>
                    </div>
                    <span style={{background: '#dcfce7', color: '#166534', padding: '6px 12px', borderRadius: '999px', fontSize: '13px', fontWeight: 600}}>Payé</span>
                  </div>

                  {/* Details grid */}
                  <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #e5e7eb'}}>
                    <div>
                      <div style={{display: 'flex', alignItems: 'center', gap: '10px', color: '#475569', marginBottom: '12px'}}>
                        <span>📅</span>
                        <span>{booking.paymentDate || booking.date}</span>
                      </div>
                      <div style={{display: 'flex', alignItems: 'center', gap: '10px', color: '#475569'}}>
                        <span>🕒</span>
                        <span>{booking.paymentTime || '14:56'}</span>
                      </div>
                    </div>
                    <div>
                      <div style={{display: 'flex', alignItems: 'center', gap: '10px', color: '#1f2937', fontWeight: 600, marginBottom: '12px'}}>
                        <span>💰</span>
                        <span>Montant</span>
                      </div>
                      <div style={{fontSize: '18px', fontWeight: 700, color: '#1f2937'}}>{booking.price} EUR</div>
                    </div>
                  </div>

                  {/* Transaction ID and download */}
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap'}}>
                    <div style={{fontSize: '12px', color: '#94a3b8'}}>
                      ID transaction: {booking.transactionId || `PAY-${Math.random().toString(36).substr(2, 24)}`}
                    </div>
                    <button 
                      onClick={() => downloadReceipt(booking.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: 'none',
                        border: '1px solid #e5e7eb',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 600,
                        color: '#1f2937'
                      }}
                    >
                      ⬇️ Télécharger le reçu
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Payments;

