import { useState } from "react";
import { Link } from "react-router-dom";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { useAuth } from "../context/AuthContext";
import Logo from "./Logo";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = (
    <>
      {(!user || user.role !== 'buyer') && (
        <Link to="/properties" className="nav-link" onClick={() => setIsOpen(false)}>Browse Properties</Link>
      )}

      {user && user.role === 'buyer' && (
        <>
          <Link to="/" className="nav-link" onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/properties" className="nav-link" onClick={() => setIsOpen(false)}>Property</Link>
          <Link to="/wishlist" className="nav-link" onClick={() => setIsOpen(false)}>Wishlist</Link>
          <Link to="/chat-messages" className="nav-link" onClick={() => setIsOpen(false)}>Messages</Link>
        </>
      )}

      {!user && (
        <>
          <Link to="/login" className="nav-link" onClick={() => setIsOpen(false)}>Login</Link>
          <Link to="/register" className="nav-link" onClick={() => setIsOpen(false)}>Register</Link>
        </>
      )}

      {user && user.role === 'seller' && (
        <>
          <Link to="/dashboard" className="nav-link" onClick={() => setIsOpen(false)}>Dashboard</Link>
        </>
      )}

      {user && user.role === 'admin' && (
        <>
          <Link to="/admin-dashboard" className="nav-link" onClick={() => setIsOpen(false)}>Admin Panel</Link>
        </>
      )}
    </>
  );

  return (
    <>
      <nav className="glass" style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        padding: 'clamp(0.5rem, 2vw, 1rem) 0',
        marginBottom: '1rem'
      }}>
        <div className="container" style={{
          padding: '0 1.5rem',
          maxWidth: '1400px'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'auto 1fr auto',
            alignItems: 'center',
            gap: '1rem'
          }}>
            {/* Left: Logo */}
            <div style={{ justifySelf: 'start' }}>
              <Logo />
            </div>

            {/* Center: Desktop Menu */}
            <div
              className="desktop-menu"
              style={{
                justifySelf: 'center',
                display: 'flex',
                alignItems: 'center',
                background: 'rgba(255, 255, 255, 0.5)',
                padding: '0.4rem 0.75rem',
                borderRadius: '2rem',
                border: '1px solid var(--glass-border)',
                gap: '0.5rem',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)'
              }}
            >
              {navLinks}
            </div>

            {/* Right: Profile Section */}
            <div style={{ justifySelf: 'end', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              {user ? (
                <div className="profile-section" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  <Link to="/profile" style={{ display: 'flex', alignItems: 'center' }}>
                    <img
                      src={`https://ui-avatars.com/api/?name=${user.name}&background=0d6e59&color=fff`}
                      alt="Profile"
                      style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid var(--primary-light)', objectFit: 'cover' }}
                    />
                  </Link>
                  <button
                    onClick={logout}
                    className="btn btn-outline logout-btn"
                    style={{ padding: '0.4rem 1rem', borderRadius: '0.75rem', fontWeight: 600, fontSize: '0.875rem' }}
                  >
                    Logout
                  </button>
                </div>
              ) : null}

              {/* Mobile Toggle */}
              <div className="mobile-toggle" onClick={toggleMenu} style={{ display: 'none', cursor: 'pointer', color: 'var(--text-main)' }}>
                {isOpen ? <HiX size={28} /> : <HiMenuAlt3 size={28} />}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Backdrop */}
      <div
        className={`mobile-backdrop ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile Menu Drawer */}
      <div className={`mobile-drawer ${isOpen ? 'open' : ''}`}>
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
            <Logo onClick={() => setIsOpen(false)} />
            <HiX size={28} onClick={() => setIsOpen(false)} style={{ cursor: 'pointer', color: 'var(--text-main)' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: 1 }}>
            {navLinks}
          </div>

          {user && (
            <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <img
                  src={`https://ui-avatars.com/api/?name=${user.name}&background=0d6e59&color=fff`}
                  alt="Profile"
                  style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{user.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.email}</div>
                </div>
              </div>
              <button
                onClick={logout}
                className="btn btn-primary"
                style={{ width: '100%' }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
          .nav-link {
              color: var(--text-main);
              font-weight: 600;
              font-size: 0.9375rem;
              padding: 0.5rem 1rem;
              border-radius: 1.5rem;
              transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
              text-decoration: none;
          }
          .nav-link:hover {
              color: var(--primary);
              background: rgba(13, 148, 136, 0.08);
          }
          .nav-link.active {
              background: var(--primary);
              color: white;
          }
          
          .mobile-backdrop {
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background: rgba(0, 0, 0, 0.4);
              backdrop-filter: blur(4px);
              z-index: 2001;
              opacity: 0;
              visibility: hidden;
              transition: all 0.3s ease;
          }
          .mobile-backdrop.active {
              opacity: 1;
              visibility: visible;
          }

          .mobile-drawer {
              position: fixed;
              top: 0;
              left: -300px;
              width: 300px;
              height: 100%;
              background: #ffffff;
              z-index: 2002;
              transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
              box-shadow: 10px 0 30px rgba(0, 0, 0, 0.1);
              border-right: 1px solid var(--border-color);
          }
          .mobile-drawer.open {
              transform: translateX(300px);
          }

          @media (max-width: 1024px) {
              .desktop-menu { display: none !important; }
              .mobile-toggle { display: block !important; }
              .logout-btn { display: none !important; }
          }
      `}</style>
    </>
  );
};

export default Navbar;
