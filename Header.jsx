import React, { useState, useContext, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from './contexts/UserContext';
import logo from './assets/logo.png';

const Header = ({ pageTitle }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  // Fermer le menu en cliquant en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="app-header">
      <div className="brand">
        <div className="brand-icon" style={{ background: '#eff6ff', width: '48px', height: '48px', padding: '1px', borderRadius: '14px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src={logo} alt="Logo Mediko" style={{ width: '150%', height: '150%', objectFit: 'cover', objectPosition: 'center', transform: 'scale(1.4)' }} />
        </div>
        <div>
          <h1>Mediko</h1>
          <p>{pageTitle}</p>
        </div>
      </div>
      <div className="header-icons" style={{ position: 'relative' }}>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="icon-circle"
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '24px' }}
        >
          👤
        </button>
        
        {menuOpen && (
          <div
            ref={menuRef}
            style={{
              position: 'absolute',
              top: '50px',
              right: '0',
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              minWidth: '220px',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
              zIndex: 1000,
              overflow: 'hidden'
            }}
          >
            {/* Mon profil */}
            <Link
              to="/profile"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                color: '#1f2937',
                textDecoration: 'none',
                fontSize: '15px',
                fontWeight: 500,
                borderBottom: '1px solid #e5e7eb',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              onClick={() => setMenuOpen(false)}
            >
              <span>👤</span>
              <span>Mon profil</span>
            </Link>
            
            {/* Se déconnecter */}
            <button
              onClick={handleLogout}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                background: 'transparent',
                border: 'none',
                textAlign: 'left',
                color: '#ef4444',
                fontSize: '15px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#fee2e2'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <span>↪️</span>
              <span>Se déconnecter</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
