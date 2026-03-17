import { useState } from "react";
import { Link } from "react-router-dom";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { useAuth } from "../../context/AuthContext";
import Logo from "./Logo";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = (
    <>
      {(!user || user.role !== 'buyer') && (
        <Link to="/properties" className="nav-link text-text-main font-semibold text-[15px] px-4 py-2 rounded-3xl transition-all duration-300 no-underline hover:text-primary hover:bg-primary/10" onClick={() => setIsOpen(false)}>Browse Properties</Link>
      )}

      {user && user.role === 'buyer' && (
        <>
          <Link to="/" className="nav-link text-text-main font-semibold text-[15px] px-4 py-2 rounded-3xl transition-all duration-300 no-underline hover:text-primary hover:bg-primary/10" onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/properties" className="nav-link text-text-main font-semibold text-[15px] px-4 py-2 rounded-3xl transition-all duration-300 no-underline hover:text-primary hover:bg-primary/10" onClick={() => setIsOpen(false)}>Property</Link>
          <Link to="/wishlist" className="nav-link text-text-main font-semibold text-[15px] px-4 py-2 rounded-3xl transition-all duration-300 no-underline hover:text-primary hover:bg-primary/10" onClick={() => setIsOpen(false)}>Wishlist</Link>
          <Link to="/chat-messages" className="nav-link text-text-main font-semibold text-[15px] px-4 py-2 rounded-3xl transition-all duration-300 no-underline hover:text-primary hover:bg-primary/10" onClick={() => setIsOpen(false)}>Messages</Link>
          <Link to="/contact" className="nav-link text-text-main font-semibold text-[15px] px-4 py-2 rounded-3xl transition-all duration-300 no-underline hover:text-primary hover:bg-primary/10" onClick={() => setIsOpen(false)}>Contact Us</Link>
        </>
      )}

      {!user && (
        <>
          <Link to="/login" className="nav-link text-text-main font-semibold text-[15px] px-4 py-2 rounded-3xl transition-all duration-300 no-underline hover:text-primary hover:bg-primary/10" onClick={() => setIsOpen(false)}>Login</Link>
          <Link to="/register" className="nav-link text-text-main font-semibold text-[15px] px-4 py-2 rounded-3xl transition-all duration-300 no-underline hover:text-primary hover:bg-primary/10" onClick={() => setIsOpen(false)}>Register</Link>
        </>
      )}

      {user && user.role === 'seller' && (
        <>
          <Link to="/dashboard" className="nav-link text-text-main font-semibold text-[15px] px-4 py-2 rounded-3xl transition-all duration-300 no-underline hover:text-primary hover:bg-primary/10" onClick={() => setIsOpen(false)}>Dashboard</Link>
        </>
      )}

      {user && user.role === 'admin' && (
        <>
          <Link to="/admin-dashboard" className="nav-link text-text-main font-semibold text-[15px] px-4 py-2 rounded-3xl transition-all duration-300 no-underline hover:text-primary hover:bg-primary/10" onClick={() => setIsOpen(false)}>Admin Panel</Link>
        </>
      )}
    </>
  );

  return (
    <>
      <nav className="glass sticky top-0 z-[1000] py-2 lg:py-4 mb-4">
        <div className="container px-6 max-w-[1400px] mx-auto">
          <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4">
            {/* Left: Logo */}
            <div className="justify-self-start">
              <Logo />
            </div>

            {/* Center: Desktop Menu */}
            <div
              className="hidden lg:flex justify-self-center items-center bg-white/50 px-3 py-1.5 rounded-full border border-white/30 gap-2 shadow-[0_4px_15px_rgba(0,0,0,0.05)]"
            >
              {navLinks}
            </div>

            {/* Right: Profile Section */}
            <div className="justify-self-end flex items-center gap-5">
              {user ? (
                <div className="flex items-center gap-5">
                  <Link to="/profile" className="flex items-center">
                    <img
                      src={user.profilePic || `https://ui-avatars.com/api/?name=${user.name}&background=0d6e59&color=fff`}
                      alt="Profile"
                      className="w-10 h-10 rounded-full border-2 border-primary-light object-cover"
                    />
                  </Link>
                  <button
                    onClick={logout}
                    className="btn btn-outline hidden lg:flex py-1.5 px-4 rounded-xl font-semibold text-sm"
                  >
                    Logout
                  </button>
                </div>
              ) : null}

              {/* Mobile Toggle */}
              <div className="lg:hidden cursor-pointer text-text-main flex" onClick={toggleMenu}>
                {isOpen ? <HiX size={28} /> : <HiMenuAlt3 size={28} />}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Backdrop */}
      <div
        className={`fixed inset-0 w-full h-full bg-black/40 backdrop-blur-sm z-[2001] transition-all duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile Menu Drawer */}
      <div className={`fixed top-0 -left-[300px] w-[300px] h-full bg-white z-[2002] transition-transform duration-300 shadow-[10px_0_30px_rgba(0,0,0,0.1)] border-r border-border flex flex-col p-6 ${isOpen ? 'translate-x-[300px]' : ''}`}>
        <div className="flex justify-between items-center mb-10">
          <Logo onClick={() => setIsOpen(false)} />
          <HiX size={28} onClick={() => setIsOpen(false)} className="cursor-pointer text-text-main" />
        </div>

        <div className="flex flex-col gap-6 flex-1 text-lg">
          {navLinks}
        </div>

        {user && (
          <div className="mt-auto pt-6 border-t border-border">
            <div className="flex items-center gap-4 mb-6">
              <img
                src={user.profilePic || `https://ui-avatars.com/api/?name=${user.name}&background=0d6e59&color=fff`}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <div className="font-semibold text-[15px]">{user.name}</div>
                <div className="text-xs text-text-muted">{user.email}</div>
              </div>
            </div>
            <button
              onClick={logout}
              className="btn btn-primary w-full"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;
