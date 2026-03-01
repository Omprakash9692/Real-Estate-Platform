import { HiLocationMarker, HiShieldCheck, HiHeart, HiOutlineHome, HiArrowsExpand, HiOutlineUserGroup } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PropertyCard = ({ property, renderActions }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleWishlistClick = (e) => {
    e.preventDefault(); // Prevent navigating to details page
    if (!user) {
      navigate('/login');
      return;
    }
    // Toggle wishlist logic would go here, for now it just shows the intent
  };

  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(property.price);

  return (
    <Link to={`/property/${property._id}`} className="fade-in property-card-link" style={{
      display: 'flex',
      flexDirection: 'column',
      background: 'white',
      borderRadius: '1.25rem',
      overflow: 'hidden',
      boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: 'pointer',
      border: '1px solid var(--border-color)',
      textDecoration: 'none',
      color: 'inherit',
      position: 'relative',
      height: '100%',
      width: '100%'
    }}>
      {/* Image Section */}
      <div style={{ position: 'relative', height: '220px', overflow: 'hidden', flexShrink: 0 }}>
        <img
          src={property.images[0] || 'https://via.placeholder.com/400x300?text=No+Image'}
          alt={property.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease'
          }}
          className="card-image"
        />

        {/* Top Badges */}
        <div style={{
          position: 'absolute',
          top: '1rem',
          left: '1rem',
          right: '1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <span style={{
              background: 'rgba(255,255,255,0.9)',
              padding: '0.25rem 0.75rem',
              borderRadius: '2rem',
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: 'var(--text-main)',
              backdropFilter: 'blur(4px)'
            }}>New</span>
            <span style={{
              background: 'var(--primary)',
              color: 'white',
              padding: '0.25rem 0.75rem',
              borderRadius: '2rem',
              fontSize: '0.75rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              textTransform: 'uppercase'
            }}>
              <HiShieldCheck size={14} /> Verified
            </span>
          </div>
          <button
            className="heart-btn"
            onClick={handleWishlistClick}
            style={{
              background: 'rgba(255,255,255,0.9)',
              border: 'none',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              color: '#64748b'
            }}>
            <HiHeart size={18} />
          </button>
        </div>

        {/* Price Overlay */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '1.5rem 1rem 0.75rem',
          background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
          color: 'white'
        }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>
            {formattedPrice}
            {property.status === 'rent' && <span style={{ fontSize: '0.875rem', fontWeight: 400 }}>/mo</span>}
          </h3>
        </div>
      </div>

      {/* Content Section */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <span style={{
          fontSize: '0.75rem',
          fontWeight: 700,
          color: 'var(--primary)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          {property.propertyType}
        </span>

        <h4 style={{
          fontSize: '1.125rem',
          fontWeight: 700,
          margin: '0.25rem 0 0.5rem',
          color: 'var(--text-main)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          minHeight: '1.5rem'
        }}>
          {property.title}
        </h4>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          color: 'var(--text-muted)',
          fontSize: '0.875rem',
          marginBottom: '1rem'
        }}>
          <HiLocationMarker style={{ color: '#94a3b8', flexShrink: 0 }} />
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {property.area}, {property.city}
          </span>
        </div>

        {/* Specs Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          padding: '1rem 0',
          borderTop: '1px solid #f1f5f9',
          gap: '0.5rem',
          marginTop: 'auto'
        }}>
          {property.propertyType?.toLowerCase() === 'commercial' ? (
            <>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: '#64748b', marginBottom: '0.25rem', display: 'flex', justifyContent: 'center' }}><HiOutlineHome size={20} /></div>
                <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-main)' }}>{property.status}</div>
                <div style={{ fontSize: '0.625rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Type</div>
              </div>
              <div style={{ textAlign: 'center', borderLeft: '1px solid #f1f5f9', borderRight: '1px solid #f1f5f9' }}>
                <div style={{ color: '#64748b', marginBottom: '0.25rem', display: 'flex', justifyContent: 'center' }}><HiArrowsExpand size={20} /></div>
                <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-main)' }}>{property.areaSize}</div>
                <div style={{ fontSize: '0.625rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Sq Ft</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: '#64748b', marginBottom: '0.25rem', display: 'flex', justifyContent: 'center' }}><HiShieldCheck size={20} /></div>
                <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-main)' }}>OK</div>
                <div style={{ fontSize: '0.625rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Legal</div>
              </div>
            </>
          ) : (
            <>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: '#64748b', marginBottom: '0.25rem', display: 'flex', justifyContent: 'center' }}><HiOutlineHome size={20} /></div>
                <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-main)' }}>{property.bhk}</div>
                <div style={{ fontSize: '0.625rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Beds</div>
              </div>
              <div style={{ textAlign: 'center', borderLeft: '1px solid #f1f5f9', borderRight: '1px solid #f1f5f9' }}>
                <div style={{ color: '#64748b', marginBottom: '0.25rem', display: 'flex', justifyContent: 'center' }}><HiOutlineUserGroup size={20} /></div>
                <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-main)' }}>
                  {Math.max(1, parseInt(property.bhk) - 1 || 0)}
                </div>
                <div style={{ fontSize: '0.625rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Baths</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: '#64748b', marginBottom: '0.25rem', display: 'flex', justifyContent: 'center' }}><HiArrowsExpand size={20} /></div>
                <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-main)' }}>{property.areaSize}</div>
                <div style={{ fontSize: '0.625rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Sq Ft</div>
              </div>
            </>
          )}
        </div>

        {/* View Details Action (Desktop/Default) */}
        {!renderActions && (
          <div style={{ marginTop: '1.25rem' }}>
            <button className="btn btn-primary" style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '0.75rem',
              fontWeight: 700,
              fontSize: '0.9375rem'
            }}>
              View Details
            </button>
          </div>
        )}

        {/* Custom Actions (Management) */}
        {renderActions && (
          <div style={{
            marginTop: '1.25rem',
            paddingTop: '1.25rem',
            borderTop: '1px dashed #e2e8f0',
            display: 'flex',
            gap: '0.5rem'
          }} onClick={(e) => e.preventDefault()}>
            {renderActions(property)}
          </div>
        )}
      </div>

      <style>{`
        .property-card-link:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.1);
        }
        .property-card-link:hover .card-image {
          transform: scale(1.05);
        }
        .heart-btn:hover {
          color: #ef4444 !important;
          transform: scale(1.1);
          background: white !important;
        }
        @media (max-width: 640px) {
          .property-card-link {
            max-width: 420px;
            margin: 0 auto;
          }
        }
      `}</style>
    </Link>
  );
};

export default PropertyCard;