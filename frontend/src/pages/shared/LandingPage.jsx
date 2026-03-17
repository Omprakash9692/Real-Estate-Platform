import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from "../../config";
import {
  HiLocationMarker, HiSearch, HiHome, HiOfficeBuilding,
  HiOutlineMap, HiLightningBolt, HiShieldCheck,
  HiCurrencyDollar, HiVideoCamera, HiMail, HiPhone
} from "react-icons/hi";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import PropertyCard from '../../components/common/PropertyCard';
import { useAuth } from "../../context/AuthContext";

const LandingPage = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [propertyType, setPropertyType] = useState("Select Type");
  const [propertyCounts, setPropertyCounts] = useState({
    flat: 0,
    villa: 0,
    penthouse: 0,
    commercial: 0
  });
  const [wishlistedIds, setWishlistedIds] = useState([]);

  useEffect(() => {
    fetchProperties();
    fetchCounts();
    if (user) {
      fetchWishlist();
    }
  }, [user]);

  const fetchWishlist = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/wishlist`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWishlistedIds(res.data.filter(item => item.property).map(item => String(item.property._id)));
    } catch (err) {
      console.error("Failed to fetch wishlist:", err);
    }
  };

  const handleToggleWishlist = async (propertyId) => {
    try {
      const isWishlisted = wishlistedIds.includes(propertyId);
      if (isWishlisted) {
        await axios.delete(`${API_URL}/api/wishlist/${propertyId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setWishlistedIds(prev => prev.filter(id => id !== propertyId));
      } else {
        await axios.post(`${API_URL}/api/wishlist/${propertyId}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setWishlistedIds(prev => [...prev, propertyId]);
      }
    } catch (err) {
      console.error("Failed to toggle wishlist:", err);
    }
  };

  const fetchCounts = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/property/counts`);
      if (res.data.success) {
        setPropertyCounts(res.data.counts);
      }
    } catch (err) {
      console.error("Failed to fetch property counts:", err);
    }
  };

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
    { name: 'Modern Flats', count: propertyCounts.flat || 0, icon: <HiOfficeBuilding size={32} />, type: 'flat' },
    { name: 'Luxury Villas', count: propertyCounts.villa || 0, icon: <HiHome size={32} />, type: 'villa' },
    { name: 'Penthouse', count: propertyCounts.penthouse || 0, icon: <HiOfficeBuilding size={32} />, type: 'penthouse' },
    { name: 'Commercial', count: propertyCounts.commercial || 0, icon: <HiOfficeBuilding size={32} />, type: 'commercial' },
  ];

  const features = [
    { title: 'Verified Trust', desc: 'Every listing is strictly audited for ownership, condition, and legality.', icon: <HiShieldCheck size={24} /> },
    { title: 'Smart Search', desc: 'Our AI-driven algorithms help you find the best matches based on preferences.', icon: <HiLightningBolt size={24} /> },
    { title: 'Best Value', desc: 'Direct-from-owner listings and zero-commission options to ensure competitive prices.', icon: <HiCurrencyDollar size={24} /> },
    { title: 'Virtual Tours', desc: 'High-definition 3D tours allow you to experience the property from home.', icon: <HiVideoCamera size={24} /> },
  ];

  return (
    <div className="bg-bg-main min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="container fade-in hero-section py-16 px-8 flex items-center gap-16 overflow-hidden max-lg:flex-col max-lg:text-center max-lg:py-8 max-lg:px-4 max-lg:gap-8">
        <div className="hero-content flex-1 max-lg:flex max-lg:flex-col max-lg:items-center">
          <span className="badge bg-primary-light text-primary-dark mb-6 inline-block">
            Trusted by 20,000+ homeowners
          </span>
          <h1 className="hero-title text-[clamp(2rem,5vw,4.5rem)] mb-6 transition-all duration-300 max-lg:text-[clamp(1.75rem,8vw,2.5rem)] max-lg:leading-tight max-lg:text-center">
            Find Your <span className="text-gradient">Perfect</span> Next Chapter.
          </h1>
          <p className="hero-subtitle text-[1.125rem] text-text-muted mb-12 max-w-[540px] max-lg:text-base max-lg:mb-10 max-lg:mx-auto max-lg:text-center max-lg:px-4">
            Experience the most advanced real estate search platform. Discover verified listings, connect with top agents, and find a place you'll love.
          </p>

          {/* Integrated Search */}
          <form onSubmit={handleSearch} className="glass search-form p-5 rounded-[2rem] flex items-center gap-4 shadow-[0_20px_40px_rgba(0,0,0,0.08)] max-w-[900px] border border-white/50 relative z-10 max-lg:flex-col max-lg:w-full max-lg:max-w-[500px] max-lg:mx-auto max-lg:gap-2 max-lg:rounded-[1.5rem]">
            <div className="search-field flex-[1.2] flex items-center gap-3 py-2 px-3 transition-all duration-300 min-w-[220px] max-lg:w-full max-lg:py-4 max-lg:px-2 max-lg:border-b max-lg:border-[#f1f5f9]">
              <div className="text-primary flex items-center">
                <HiLocationMarker size={26} />
              </div>
              <div className="flex flex-col flex-1">
                <label className="text-[0.7rem] font-extrabold text-text-muted uppercase tracking-[0.05em] mb-1">Location</label>
                <input
                  type="text"
                  placeholder="Where are you looking?"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-none bg-transparent outline-none w-full text-base font-semibold text-text-main"
                />
              </div>
            </div>
            <div className="search-divider w-[1px] h-[44px] bg-border-color opacity-60 shrink-0 max-lg:hidden"></div>
            <div className="search-field flex-1 flex items-center gap-3 py-2 px-3 transition-all duration-300 min-w-[200px] max-lg:w-full max-lg:py-4 max-lg:px-2 max-lg:mb-2 max-lg:border-none">
              <div className="text-primary flex items-center">
                <HiHome size={26} />
              </div>
              <div className="flex flex-col flex-1">
                <label className="text-[0.7rem] font-extrabold text-text-muted uppercase tracking-[0.05em] mb-1">Property Type</label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="border-none bg-transparent outline-none w-full cursor-pointer text-base font-semibold text-text-main p-0 appearance-none"
                >
                  <option value="Select Type">Select Type</option>
                  <option value="flat">Flat/Apartment</option>
                  <option value="villa">Villa/House</option>
                  <option value="penthouse">Penthouse</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>
            </div>
            <button type="submit" className="btn btn-primary search-button h-[64px] min-w-[140px] rounded-[1.25rem] text-base font-bold shadow-[0_12px_24px_rgba(13,148,136,0.25)] flex items-center justify-center gap-2 max-lg:w-full max-lg:h-[56px] max-lg:rounded-2xl max-lg:mt-2">
              <HiSearch size={22} /> Search
            </button>
          </form>

          {/* Stats */}
          <div className="stats-container flex gap-[clamp(1rem,3vw,4rem)] mt-16 max-lg:justify-center max-lg:gap-8 max-md:flex-wrap">
            <div className="flex-1 max-md:flex-none max-md:shrink-0 max-md:basis-[120px]">
              <h3 className="text-[clamp(1.5rem,3vw,2rem)] font-extrabold">12k+</h3>
              <p className="uppercase text-[0.7rem] text-text-muted font-extrabold tracking-[0.05em]">Ready Properties</p>
            </div>
            <div className="stat-item border-l border-border-color pl-[clamp(1rem,3vw,4rem)] flex-1 max-lg:pl-8 max-md:border-none max-md:pl-0 max-md:flex-none max-md:shrink-0 max-md:basis-[120px]">
              <h3 className="text-[clamp(1.5rem,3vw,2rem)] font-extrabold">500+</h3>
              <p className="uppercase text-[0.7rem] text-text-muted font-extrabold tracking-[0.05em]">Agent Network</p>
            </div>
            <div className="stat-item border-l border-border-color pl-[clamp(1rem,3vw,4rem)] flex-1 max-lg:pl-8 max-md:border-none max-md:pl-0 max-md:flex-none max-md:shrink-0 max-md:basis-[120px]">
              <h3 className="text-[clamp(1.5rem,3vw,2rem)] font-extrabold">4.9/5</h3>
              <p className="uppercase text-[0.7rem] text-text-muted font-extrabold tracking-[0.05em]">User Rating</p>
            </div>
          </div>
        </div>

        {/* Hero Image */}
        <div className="hero-image-container flex-1 relative max-md:hidden">
          <div className="rounded-[3rem] overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.25)] relative">
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Luxury Home"
              className="w-full h-[600px] object-cover"
            />
            {/* Verified Badge Overlay */}
            <div className="glass absolute bottom-8 left-8 p-6 rounded-3xl flex items-center gap-4 max-w-[300px]">
              <div className="bg-primary-light p-3 rounded-2xl">
                <HiShieldCheck size={24} className="text-primary" />
              </div>
              <div>
                <h4 className="text-[0.9375rem] m-0 font-bold">Verified Listing</h4>
                <p className="text-[0.75rem] text-text-muted m-0">Inspected by our professional team</p>
              </div>
              <span className="badge bg-primary/10 text-primary text-[0.625rem]">Pre-Approved</span>
            </div>
          </div>
        </div>
      </section>

      {/* Category Section */}
      <section className="py-24 bg-bg-alt">
        <div className="container">
          <div className="category-header flex justify-between items-end mb-12 max-sm:flex-col max-sm:items-start max-sm:gap-6">
            <div className="max-w-[500px]">
              <h2 className="text-[2.5rem] font-extrabold mb-4 max-sm:text-[2rem]">Browse by Category</h2>
              <p className="text-text-muted">Explore curated collections of properties tailored to your specific lifestyle and needs.</p>
            </div>
          </div>
          <div className="category-grid grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6 max-sm:grid-cols-2 max-sm:gap-4">
            {categories.map((cat, idx) => (
              <div
                key={idx}
                className="category-card py-10 px-6 text-center cursor-pointer bg-white rounded-3xl border border-border-color transition-all duration-300 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] hover:-translate-y-2 hover:border-primary hover:shadow-[0_12px_25px_-5px_rgba(13,148,136,0.1)] group max-sm:py-6 max-sm:px-4"
                onClick={() => navigate(`/properties?type=${cat.type}`)}
              >
                <div className="category-icon-wrapper w-16 h-16 bg-primary-light text-primary rounded-[1.25rem] flex items-center justify-center mx-auto mb-6 transition-all duration-300 group-hover:bg-primary group-hover:text-white group-hover:scale-110 max-sm:w-12 max-sm:h-12 max-sm:mb-4 max-sm:rounded-2xl">
                  {cat.icon}
                </div>
                <h3 className="mb-2 text-xl font-bold max-sm:text-base">{cat.name}</h3>
                <p className="text-text-muted text-[0.875rem]">{cat.count.toLocaleString()} Properties</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32">
        <div className="container features-container flex gap-24 items-center max-lg:flex-col max-lg:gap-12">
          <div className="features-list-container flex-1 grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-8 max-md:grid-cols-1 max-md:gap-8">
            {features.map((f, idx) => (
              <div key={idx} className="fade-in feature-card-item p-8 bg-white rounded-3xl border border-border-color transition-all duration-300 flex flex-col items-start hover:border-primary hover:-translate-y-[5px] hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)]" style={{ animationDelay: `${idx * 0.1}s` }}>
                <div className="w-14 h-14 bg-primary-light text-primary rounded-2xl flex items-center justify-center mb-6">
                  {f.icon}
                </div>
                <h3 className="text-[1.125rem] mb-3 font-extrabold">{f.title}</h3>
                <p className="text-text-muted text-[0.875rem] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
          <div className="flex-1">
            <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-extrabold mb-8">
              Why RealEstate<br />is the <span className="text-gradient">Preferred Choice.</span>
            </h2>
            <p className="text-text-muted text-[1.125rem] mb-12 leading-[1.8]">
              We've reinvented the property search experience from the ground up. By focusing on transparency, technological precision, and user-centric design, we help you find not just a house, but a home.
            </p>
            <ul className="flex flex-col gap-6">
              {[
                'Direct connection with certified agents',
                'Real-time market valuation data',
                'Secure document management system',
                '24/7 Premium customer support'
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-4 font-medium">
                  <HiLightningBolt className="text-primary" /> {item}
                </li>
              ))}
            </ul>
            <a href="#process" className="inline-block mt-12 text-primary font-semibold border-b-2 hover:text-primary-dark">
              Learn more about our process &rarr;
            </a>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="process" className="py-32 bg-bg-main">
        <div className="container">
          <div className="text-center mb-20">
            <span className="badge bg-primary/10 text-primary mb-4 inline-block">
              How It Works
            </span>
            <h2 className="text-5xl mb-6 max-sm:text-4xl text-text-main font-extrabold">Our Seamless <span className="text-gradient">Process</span></h2>
            <p className="text-text-muted max-w-[600px] mx-auto text-lg">
              We've simplified the journey of finding your dream home into three clear, stress-free steps.
            </p>
          </div>

          <div className="process-grid grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-12 relative max-md:gap-14">
            {[
              {
                step: '01',
                title: 'Smart Search',
                desc: 'Leverage our AI-driven Smart Search algorithms to find the best property matches tailored to your specific preferences.',
                icon: <HiLightningBolt size={32} />
              },
              {
                step: '02',
                title: 'Virtual Tours',
                desc: 'Experience your future home from anywhere with our high-definition 3D virtual tours and immersive walkthroughs.',
                icon: <HiVideoCamera size={32} />
              },
              {
                step: '03',
                title: 'Verified Trust',
                desc: 'Every listing is strictly audited for ownership and condition, ensuring your peace of mind and a secure transaction.',
                icon: <HiShieldCheck size={32} />
              }
            ].map((p, idx) => (
              <div key={idx} className="process-card py-12 px-8 bg-white/40 backdrop-blur-md rounded-[2rem] border border-white/50 relative transition-all duration-300 text-center hover:-translate-y-2 hover:bg-white hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:border-primary-light">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-16 h-16 bg-primary text-white rounded-[1.5rem] flex items-center justify-center text-2xl font-extrabold shadow-[0_8px_20px_rgba(13,148,136,0.3)]">
                  {p.step}
                </div>
                <div className="w-20 h-20 bg-primary-light text-primary rounded-[2rem] flex items-center justify-center mx-auto mt-4 mb-8">
                  {p.icon}
                </div>
                <h3 className="text-[1.5rem] mb-4 font-bold">{p.title}</h3>
                <p className="text-text-muted leading-[1.7]">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="py-24 bg-bg-alt">
        <div className="container">
          <div className="text-center mb-16">
            <span className="badge bg-primary-light text-primary mb-4 inline-block">
              Handpicked For You
            </span>
            <h2 className="text-5xl mb-6 max-sm:text-4xl font-extrabold text-text-main">Featured Collections</h2>
            <p className="text-text-muted max-w-[600px] mx-auto text-lg pt-1 pb-1">
              Discover high-value properties curated by our experts for their exceptional design, location, and investment potential.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20 min-h-[400px]">
              <div className="loader w-10 h-10 border-4 border-solid border-secondary border-t-primary rounded-full animate-spin mx-auto"></div>
            </div>
          ) : error ? (
            <div className="text-center py-20 text-red-500 min-h-[300px]">
              <p>{error}</p>
            </div>
          ) : (
            <div className="grid gap-8 grid-cols-[repeat(auto-fit,minmax(300px,1fr))] max-sm:grid-cols-1">
              {properties.filter(p => p)
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 6)
                .map((property) => (
                  <PropertyCard
                    key={property._id}
                    property={property}
                    isWishlisted={wishlistedIds.includes(String(property._id))}
                    onToggleWishlist={handleToggleWishlist}
                  />
                ))}
            </div>
          )}

          <div className="text-center mt-20">
            <button
              onClick={() => navigate('/properties')}
              className="btn btn-primary py-4 px-12 rounded-3xl"
            >
              Discover More Properties
            </button>
          </div>
        </div>
      </section>

      <footer className="bg-white border-t border-border-color pt-24 pb-0">
        <div className="container">
          <div className="footer-main-grid grid grid-cols-[1.5fr_1fr_1fr_1.5fr] gap-16 mb-16 max-lg:grid-cols-2 max-lg:gap-12 max-sm:grid-cols-1 min-[640px]:max-[1024px]:justify-items-center">
            {/* Column 1: Brand & About */}
            <div className="footer-brand-section max-sm:text-center max-sm:flex max-sm:flex-col max-sm:items-center">
              <div className="flex items-center gap-2 text-2xl font-extrabold text-primary mb-6">
                <div className="bg-primary text-white py-1.5 px-2.5 rounded-xl text-base">RE</div>
                RealEstate
              </div>
              <p className="text-text-muted mb-8 leading-relaxed text-[0.9375rem]">
                The most trusted platform for buying, selling, and renting premium real estate globally. We make property hunting seamless.
              </p>
              <div className="flex gap-4">
                {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map((Icon, idx) => (
                  <a key={idx} href="#" className="social-icon w-9 h-9 rounded-full bg-bg-alt flex items-center justify-center text-text-main transition-all duration-300 hover:-translate-y-1 hover:bg-primary hover:text-white">
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h4 className="text-[1.125rem] font-extrabold mb-8">Company</h4>
              <ul className="flex flex-col gap-5 text-text-muted text-[0.9375rem]">
                <li><a href="#" className="footer-link transition-colors duration-300 hover:text-primary hover:underline">About Us</a></li>
                <li><a href="#" className="footer-link transition-colors duration-300 hover:text-primary hover:underline">Our Services</a></li>
                <li><a href="#" className="footer-link transition-colors duration-300 hover:text-primary hover:underline">Market Trends</a></li>
                <li><a href="#" className="footer-link transition-colors duration-300 hover:text-primary hover:underline">Careers</a></li>
              </ul>
            </div>

            {/* Column 3: Contact Info */}
            <div>
              <h4 className="text-[1.125rem] font-extrabold mb-8">Support</h4>
              <ul className="flex flex-col gap-5 text-text-muted text-[0.9375rem]">
                <li className="flex items-center gap-3">
                  <HiMail className="text-primary text-xl" /> contact@reestate.com
                </li>
                <li className="flex items-center gap-3">
                  <HiPhone className="text-primary text-xl" /> +91 98765 43210
                </li>
                <li className="flex items-start gap-3">
                  <HiLocationMarker className="text-primary shrink-0 mt-[2px] text-xl" />
                  123 Business Hub, Rourkela, Odisha, India
                </li>
              </ul>
            </div>

            {/* Column 4: Newsletter */}
            <div>
              <h4 className="text-[1.125rem] font-extrabold mb-8">Newsletter</h4>
              <p className="text-text-muted text-[0.875rem] mb-6 leading-relaxed">
                Subscribe to get the latest listings and market insights directly in your inbox.
              </p>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full py-4 pr-[85px] pl-5 rounded-2xl border border-border-color bg-bg-alt outline-none text-[0.875rem] focus:border-primary transition-colors"
                />
                <button className="btn btn-primary absolute right-1.5 top-1.5 bottom-1.5 px-5 rounded-xl text-[0.8125rem]">
                  Join
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-border-color py-8 flex justify-between items-center text-[0.875rem] text-text-muted flex-wrap gap-4 max-sm:flex-col-reverse max-sm:justify-center">
            <p>© {new Date().getFullYear()} RE RealEstate. All rights reserved.</p>
            <div className="flex gap-8 max-sm:w-full max-sm:justify-center max-sm:flex-wrap max-sm:gap-4">
              <a href="#" className="footer-link transition-colors duration-300 hover:text-primary hover:underline">Privacy Policy</a>
              <a href="#" className="footer-link transition-colors duration-300 hover:text-primary hover:underline">Terms of Service</a>
              <a href="#" className="footer-link transition-colors duration-300 hover:text-primary hover:underline">Cookies Settings</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;