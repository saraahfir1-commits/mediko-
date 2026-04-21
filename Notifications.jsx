import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { NotificationsContext } from './contexts/NotificationsContext';
import Header from './Header';
import "./DoctorSearch.css";

const Notifications = () => {
  const notifsData = useContext(NotificationsContext);
  const unreadCount = notifsData.notifications.filter(n => !n.read).length;
  const total = notifsData.notifications.length;
  const unreadLabel = unreadCount > 1 ? `${unreadCount} non lues` : `${unreadCount} non lue`;



  return (
    <div className="page-wrapper notifications-page">
      <Header pageTitle="Votre santé en ligne" />

      <nav className="top-actions">
        <Link to="/" className="tab">
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
        <Link to="/notifications" className="tab active">
          <span className="emoji-icon">🔔</span>
          Notifications
        </Link>
        <Link to="/profile" className="tab">
          <span className="emoji-icon">👤</span>
          Profil
        </Link>
      </nav>

      <main className="card notifications-content">
        <div className="notifications-card-header">
          <div>
            <h2>Centre de notifications</h2>
            <p className="notifications-subtitle">Gérez toutes vos notifications et alertes</p>
          </div>
          <button className="btn-mark-read" onClick={notifsData.markAllAsRead}>
            <span>✓</span> Tout marquer comme lu
          </button>
        </div>

        <div className="notifications-summary">
          <div className="summary-left">
            <h3>Toutes les notifications</h3>
            {unreadCount > 0 && <span className="summary-badge">{unreadLabel}</span>}
          </div>
          <p className="summary-count">{total} notification{total !== 1 ? 's' : ''} au total</p>
        </div>

        <div className="notifications-list">
          {total === 0 ? (
            <div className="empty">Aucune notification pour le moment</div>
          ) : (
            notifsData.notifications.map(notif => (
              <article key={notif.id} className={`notification-entry ${notif.read ? 'read' : 'unread'}`}>
                <div className="notification-entry-left">
                  <span className="notification-entry-icon">i</span>
                </div>
                <div className="notification-entry-content">
                  <div className="notification-entry-title-row">
                    <h4>{notif.title}</h4>
                  </div>
                  <span className="notification-entry-tag">Information</span>
                  <p>{notif.desc}</p>
                  <div className="notification-entry-footer">
                    <span className="notification-time">{new Date(notif.timestamp).toLocaleString('fr-FR')}</span>
                  </div>
                  <div className="notification-entry-actions">
                    {!notif.read && (
                      <button className="notification-action-button" onClick={() => notifsData.markAsRead(notif.id)}>
                        ✓ Marquer comme lu
                      </button>
                    )}
                    <button className="notification-action-delete" onClick={() => notifsData.clearNotification(notif.id)}>
                      Supprimer
                    </button>
                  </div>
                </div>
                {!notif.read && <span className="notification-entry-indicator"></span>}
              </article>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default Notifications;







