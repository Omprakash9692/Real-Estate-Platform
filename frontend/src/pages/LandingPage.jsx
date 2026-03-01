import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from "../config";
import {
  HiLocationMarker, HiSearch, HiHome, HiOfficeBuilding,
  HiOutlineMap, HiLightningBolt, HiShieldCheck,
  HiCurrencyDollar, HiVideoCamera, HiMail, HiPhone
} from "react-icons/hi";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PropertyCard from '../components/PropertyCard';

const LandingPage = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [propertyType, setPropertyType] = useState("Select Type");

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async (search = "") => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/property?city=${search}`);
      setProperties(res.data.properties || res.data || []);
      setError(null);
    } catch (err) {
      setError("Failed to load properties. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm) params.append('city', searchTerm);
    if (propertyType !== 'Select Type') params.append('type', propertyType);
    navigate(`/properties?${params.toString()}`);
  };

  const categories = [
    { name: 'Modern Flats', count: '1,240', icon: <HiOfficeBuilding size={32} />, type: 'flat' },
    { name: 'Luxury Villas', count: '482', icon: <HiHome size={32} />, type: 'villa' },
    { name: 'Penthouse', count: '125', icon: <HiOfficeBuilding size={32} />, type: 'penthouse' },
    { name: 'Commercial', count: '356', icon: <HiOfficeBuilding size={32} />, type: 'commercial' },
  ];

  const features = [
    { title: 'Verified Trust', desc: 'Every listing is strictly audited for ownership, condition, and legality.', icon: <HiShieldCheck size={24} /> },
    { title: 'Smart Search', desc: 'Our AI-driven algorithms help you find the best matches based on preferences.', icon: <HiLightningBolt size={24} /> },
    { title: 'Best Value', desc: 'Direct-from-owner listings and zero-commission options to ensure competitive prices.', icon: <HiCurrencyDollar size={24} /> },
    { title: 'Virtual Tours', desc: 'High-definition 3D tours allow you to experience the property from home.', icon: <HiVideoCamera size={24} /> },
  ];

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh' }}>
      <Navbar />

      {/* Hero Section */}
      <section className="container fade-in hero-section" style={{ padding: '4rem 2rem', display: 'flex', alignItems: 'center', gap: '4rem', overflow: 'hidden' }}>
        <div className="hero-content" style={{ flex: 1 }}>
          <span className="badge" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary-dark)', marginBottom: '1.5rem', display: 'inline-block' }}>
            Trusted by 20,000+ homeowners
          </span>
          <h1 className="hero-title" style={{ fontSize: 'clamp(2rem, 5vw, 4.5rem)', marginBottom: '1.5rem', transition: 'font-size 0.3s' }}>
            Find Your <span className="text-gradient">Perfect</span> Next Chapter.
          </h1>
          <p className="hero-subtitle" style={{ fontSize: '1.125rem', color: 'var(--text-muted)', marginBottom: '3rem', maxWidth: '540px' }}>
            Experience the most advanced real estate search platform. Discover verified listings, connect with top agents, and find a place you'll love.
          </p>

          {/* Integrated Search */}
          <form onSubmit={handleSearch} className="glass search-form" style={{
            padding: '1.25rem',
            borderRadius: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
            maxWidth: '900px',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            position: 'relative',
            zIndex: 10
          }}>
            <div className="search-field" style={{ flex: 1.2, display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0.75rem', transition: 'all 0.3s ease', minWidth: '220px' }}>
              <div style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center' }}>
                <HiLocationMarker size={26} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <label style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Location</label>
                <input
                  type="text"
                  placeholder="Where are you looking?"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)' }}
                />
              </div>
            </div>
            <div className="search-divider" style={{ width: '1px', height: '44px', background: 'var(--border-color)', opacity: 0.6, flexShrink: 0 }}></div>
            <div className="search-field" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0.75rem', transition: 'all 0.3s ease', minWidth: '200px' }}>
              <div style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center' }}>
                <HiHome size={26} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <label style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Property Type</label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', cursor: 'pointer', fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)', padding: 0 }}
                >
                  <option value="Select Type">Select Type</option>
                  <option value="flat">Flat/Apartment</option>
                  <option value="villa">Villa/House</option>
                  <option value="penthouse">Penthouse</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>
            </div>
            <button type="submit" className="btn btn-primary search-button" style={{
              height: '64px',
              minWidth: '140px',
              borderRadius: '1.25rem',
              fontSize: '1rem',
              fontWeight: 700,
              boxShadow: '0 12px 24px rgba(13, 148, 136, 0.25)'
            }}>
              <HiSearch size={22} /> Search
            </button>
          </form>

          {/* Stats */}
          <div className="stats-container" style={{ display: 'flex', gap: 'clamp(1rem, 3vw, 4rem)', marginTop: '4rem' }}>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800 }}>12k+</h3>
              <p style={{ textTransform: 'uppercase', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800, letterSpacing: '0.05em' }}>Ready Properties</p>
            </div>
            <div className="stat-item" style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: 'clamp(1rem, 3vw, 4rem)', flex: 1 }}>
              <h3 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800 }}>500+</h3>
              <p style={{ textTransform: 'uppercase', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800, letterSpacing: '0.05em' }}>Agent Network</p>
            </div>
            <div className="stat-item" style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: 'clamp(1rem, 3vw, 4rem)', flex: 1 }}>
              <h3 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800 }}>4.9/5</h3>
              <p style={{ textTransform: 'uppercase', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800, letterSpacing: '0.05em' }}>User Rating</p>
            </div>
          </div>
        </div>

        {/* Hero Image */}
        <div className="hero-image-container" style={{ flex: 1, position: 'relative' }}>
          <div style={{
            borderRadius: '3rem',
            overflow: 'hidden',
            boxShadow: '0 40px 80px -20px rgba(0,0,0,0.25)',
            position: 'relative'
          }}>
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Luxury Home"
              style={{ width: '100%', height: '600px', objectFit: 'cover' }}
            />
            {/* Verified Badge Overlay */}
            <div className="glass" style={{
              position: 'absolute',
              bottom: '2rem',
              left: '2rem',
              padding: '1.5rem',
              borderRadius: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              maxWidth: '300px'
            }}>
              <div style={{ backgroundColor: 'var(--primary-light)', padding: '0.75rem', borderRadius: '1rem' }}>
                <HiShieldCheck size={24} style={{ color: 'var(--primary)' }} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.9375rem' }}>Verified Listing</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Inspected by our professional team</p>
              </div>
              <span className="badge" style={{ backgroundColor: 'rgba(13,148,136,0.1)', color: 'var(--primary)', fontSize: '0.625rem' }}>Pre-Approved</span>
            </div>
          </div>
        </div>
      </section>

      {/* Category Section */}
      <section style={{ padding: '6rem 0', backgroundColor: 'var(--bg-alt)' }}>
        <div className="container">
          <div className="category-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
            <div style={{ maxWidth: '500px' }}>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Browse by Category</h2>
              <p style={{ color: 'var(--text-muted)' }}>Explore curated collections of properties tailored to your specific lifestyle and needs.</p>
            </div>
            <button className="btn btn-outline">Explore All &rarr;</button>
          </div>
          <div className="category-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.5rem'
          }}>
            {categories.map((cat, idx) => (
              <div
                key={idx}
                className="category-card"
                onClick={() => navigate(`/properties?type=${cat.type}`)}
                style={{
                  padding: '2.5rem 1.5rem',
                  textAlign: 'center',
                  cursor: 'pointer',
                  background: 'white',
                  borderRadius: '1.5rem',
                  border: '1px solid var(--border-color)',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
                }}
              >
                <div style={{
                  width: '64px',
                  height: '64px',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary)',
                  borderRadius: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem',
                  transition: 'all 0.3s ease'
                }} className="category-icon-wrapper">
                  {cat.icon}
                </div>
                <h3 style={{ marginBottom: '0.5rem', fontSize: '1.25rem' }}>{cat.name}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{cat.count} Properties</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '8rem 0' }}>
        <div className="container features-container" style={{ display: 'flex', gap: '6rem', alignItems: 'center' }}>
          <div className="features-list-container" style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem' }}>
            {features.map((f, idx) => (
              <div key={idx} className="fade-in feature-card-item" style={{
                animationDelay: `${idx * 0.1}s`,
                padding: '2rem',
                background: 'white',
                borderRadius: '1.5rem',
                border: '1px solid var(--border-color)',
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start'
              }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary)',
                  borderRadius: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.5rem',
                }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: '1.125rem', marginBottom: '0.75rem', fontWeight: 800 }}>{f.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: '1.6' }}>{f.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', marginBottom: '2rem' }}>
              Why RealEstate<br />is the <span className="text-gradient">Preferred Choice.</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem', marginBottom: '3rem', lineHeight: '1.8' }}>
              We've reinvented the property search experience from the ground up. By focusing on transparency, technological precision, and user-centric design, we help you find not just a house, but a home.
            </p>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {[
                'Direct connection with certified agents',
                'Real-time market valuation data',
                'Secure document management system',
                '24/7 Premium customer support'
              ].map((item, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontWeight: 500 }}>
                  <HiLightningBolt style={{ color: 'var(--primary)' }} /> {item}
                </li>
              ))}
            </ul>
            <a href="#process" style={{ display: 'inline-block', marginTop: '3rem', color: 'var(--primary)', fontWeight: 600, borderBottom: '2px solid' }}>
              Learn more about our process &rarr;
            </a>
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <section style={{ padding: '6rem 0', backgroundColor: 'var(--bg-alt)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span className="badge" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)', marginBottom: '1rem', display: 'inline-block' }}>
              Handpicked For You
            </span>
            <h2 style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>Featured Collections</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
              Discover high-value properties curated by our experts for their exceptional design, location, and investment potential.
            </p>
          </div>

          {loading ? (
            <div className="loader-container">
              <div className="loader"></div>
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '5rem 0', color: '#ef4444' }}>
              <p>{error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-3">
              {properties.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '5rem' }}>
            <button className="btn btn-primary" style={{ padding: '1rem 3rem', borderRadius: '1.5rem' }}>
              Discover More Properties
            </button>
          </div>
        </div>
      </section>

      <footer style={{ backgroundColor: '#fff', borderTop: '1px solid var(--border-color)', paddingTop: '6rem' }}>
        <div className="container">
          <div className="footer-main-grid" style={{
            display: 'grid',
            gridTemplateColumns: '1.5fr 1fr 1fr 1.5fr',
            gap: '4rem',
            marginBottom: '4rem'
          }}>
            {/* Column 1: Brand & About */}
            <div className="footer-brand-section">
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '1.5rem',
                fontWeight: 800,
                color: 'var(--primary)',
                marginBottom: '1.5rem'
              }}>
                <div style={{ background: 'var(--primary)', color: 'white', padding: '6px 10px', borderRadius: '10px', fontSize: '1rem' }}>RE</div>
                RealEstate
              </div>
              <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: '1.7', fontSize: '0.9375rem' }}>
                The most trusted platform for buying, selling, and renting premium real estate globally. We make property hunting seamless.
              </p>
              <div style={{ display: 'flex', gap: '1rem' }}>
                {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map((Icon, idx) => (
                  <a key={idx} href="#" className="social-icon" style={{
                    width: '36px', height: '36px', borderRadius: '50%', background: 'var(--bg-alt)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-main)',
                    transition: 'all 0.3s ease'
                  }}>
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h4 style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: '2rem' }}>Company</h4>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', color: 'var(--text-muted)', fontSize: '0.9375rem' }}>
                <li><a href="#" className="footer-link">About Us</a></li>
                <li><a href="#" className="footer-link">Our Services</a></li>
                <li><a href="#" className="footer-link">Market Trends</a></li>
                <li><a href="#" className="footer-link">Careers</a></li>
              </ul>
            </div>

            {/* Column 3: Contact Info */}
            <div>
              <h4 style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: '2rem' }}>Support</h4>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', color: 'var(--text-muted)', fontSize: '0.9375rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <HiMail style={{ color: 'var(--primary)' }} /> contact@reestate.com
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <HiPhone style={{ color: 'var(--primary)' }} /> +91 98765 43210
                </li>
                <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem' }}>
                  <HiLocationMarker style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
                  123 Business Hub, Rourkela, Odisha, India
                </li>
              </ul>
            </div>

            {/* Column 4: Newsletter */}
            <div>
              <h4 style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: '2rem' }}>Newsletter</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                Subscribe to get the latest listings and market insights directly in your inbox.
              </p>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  style={{
                    width: '100%', padding: '1rem 1.25rem', borderRadius: '1rem', border: '1px solid var(--border-color)',
                    background: 'var(--bg-alt)', outline: 'none', fontSize: '0.875rem'
                  }}
                />
                <button className="btn btn-primary" style={{
                  position: 'absolute', right: '5px', top: '5px', bottom: '5px',
                  padding: '0 1.25rem', borderRadius: '0.75rem', fontSize: '0.8125rem'
                }}>
                  Join
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div style={{
            borderTop: '1px solid var(--border-color)',
            padding: '2rem 0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.875rem',
            color: 'var(--text-muted)',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <p>© {new Date().getFullYear()} RE RealEstate. All rights reserved.</p>
            <div style={{ display: 'flex', gap: '2rem' }}>
              <a href="#" className="footer-link">Privacy Policy</a>
              <a href="#" className="footer-link">Terms of Service</a>
              <a href="#" className="footer-link">Cookies Settings</a>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
                .loader {
                    border: 4px solid var(--secondary);
                    border-top: 4px solid var(--primary);
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    animation: spin 1s linear infinite;
                    margin: 0 auto;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                .feature-card-item:hover {
                    border-color: var(--primary) !important;
                    transform: translateY(-5px);
                    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
                }

                .footer-link:hover {
                    color: var(--primary);
                    text-decoration: underline;
                }

                .social-icon:hover {
                    background-color: var(--primary) !important;
                    color: white !important;
                    transform: translateY(-3px);
                }

                @media (max-width: 1024px) {
                    .footer-main-grid {
                        grid-template-columns: 1fr 1fr !important;
                        gap: 3rem !important;
                    }
                }

                @media (max-width: 640px) {
                    .footer-main-grid {
                        grid-template-columns: 1fr !important;
                    }
                    .footer-brand-section {
                        text-align: center;
                        align-items: center;
                        display: flex;
                        flex-direction: column;
                    }
                }

                @media (max-width: 1024px) {
                    .hero-section {
                        flex-direction: column !important;
                        text-align: center !important;
                        padding: 2rem 1rem !important;
                        gap: 2rem !important;
                    }
                    .hero-content {
                        display: flex !important;
                        flex-direction: column !important;
                        align-items: center !important;
                    }
                    .hero-title {
                        font-size: clamp(1.75rem, 8vw, 2.5rem) !important;
                        line-height: 1.1 !important;
                        margin-bottom: 1.25rem !important;
                        text-align: center !important;
                    }
                    .hero-subtitle {
                        font-size: 1rem !important;
                        margin: 0 auto 2.5rem !important;
                        text-align: center !important;
                        padding: 0 1rem !important;
                    }
                    .search-form {
                        flex-direction: column !important;
                        width: 100% !important;
                        max-width: 500px !important;
                        margin: 0 auto !important;
                        padding: 1.5rem !important;
                        gap: 0.5rem !important;
                        border-radius: 1.5rem !important;
                    }
                    .search-divider {
                        display: none !important;
                    }
                    .search-field {
                        width: 100% !important;
                        padding: 1rem 0.5rem !important;
                        border-bottom: 1px solid #f1f5f9 !important;
                        gap: 1.25rem !important;
                    }
                    .search-field:last-of-type {
                        border-bottom: none !important;
                        margin-bottom: 0.5rem !important;
                    }
                    .search-button {
                        width: 100% !important;
                        height: 56px !important;
                        border-radius: 1rem !important;
                    }
                    .stats-container {
                        justify-content: center !important;
                        gap: 2rem !important;
                    }
                    .stat-item {
                        padding-left: 2rem !important;
                    }
                    .features-container {
                        flex-direction: column !important;
                        gap: 3rem !important;
                    }
                    .footer-grid {
                        grid-template-columns: 1fr 1fr !important;
                        gap: 3rem !important;
                    }
                }

                @media (max-width: 991px) {
                    .hero-search-bar {
                        flex-direction: column !important;
                        height: auto !important;
                        padding: 1.5rem !important;
                        gap: 1.25rem !important;
                        border-radius: 2rem !important;
                        box-shadow: 0 15px 35px rgba(0,0,0,0.1) !important;
                    }
                    .search-divider {
                        display: none !important;
                    }
                    .search-field {
                        width: 100% !important;
                        padding: 0.5rem 0 !important;
                    }
                    .search-button {
                        width: 100% !important;
                        height: 56px !important;
                        border-radius: 1rem !important;
                        margin-top: 0.5rem !important;
                    }
                }

                @media (max-width: 768px) {
                    .hero-image-container {
                        display: none !important;
                    }
                    .stats-container {
                        flex-wrap: wrap !important;
                    }
                    .stat-item {
                        border-left: none !important;
                        padding-left: 0 !important;
                        flex: 1 1 120px !important;
                    }
                    .features-list-container {
                        grid-template-columns: 1fr !important;
                        gap: 2rem !important;
                    }
                }

                @media (max-width: 640px) {
                    .category-header {
                        flex-direction: column !important;
                        align-items: flex-start !important;
                        gap: 1.5rem !important;
                    }
                    .footer-grid {
                        grid-template-columns: 1fr !important;
                        gap: 2.5rem !important;
                    }
                    .category-grid {
                        grid-template-columns: repeat(2, 1fr) !important;
                        gap: 1rem !important;
                    }
                    .category-card {
                        padding: 1.5rem 1rem !important;
                    }
                    .category-icon-wrapper {
                        width: 48px !important;
                        height: 48px !important;
                        margin-bottom: 1rem !important;
                        border-radius: 1rem !important;
                    }
                    .category-card h3 {
                        fontSize: '1rem' !important;
                    }
                    .grid.grid-cols-3 {
                        grid-template-columns: 1fr !important;
                        justify-items: center !important;
                        gap: 2rem !important;
                    }
                }
                .category-card:hover {
                    transform: translateY(-8px);
                    border-color: var(--primary) !important;
                    box-shadow: 0 12px 25px -5px rgba(13, 148, 136, 0.1) !important;
                }
                .category-card:hover .category-icon-wrapper {
                    background-color: var(--primary) !important;
                    color: white !important;
                    transform: scale(1.1);
                }
            `}</style>
    </div>
  );
};

export default LandingPage;