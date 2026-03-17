import { HiLocationMarker, HiShieldCheck, HiHeart, HiOutlineHeart, HiOutlineHome, HiArrowsExpand, HiOutlineUserGroup, HiEye } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const PropertyCard = ({ property, renderActions, isWishlisted, onToggleWishlist }) => {
  if (!property) return null;
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleWishlistClick = (e) => {
    e.preventDefault(); // Prevent navigating to details page
    e.stopPropagation(); // Double safety

    if (!user) {
      navigate('/login');
      return;
    }

    if (onToggleWishlist) {
      onToggleWishlist(property._id);
    }
  };

  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(property.price);

  return (
    <div className="fade-in group flex flex-col bg-white rounded-[1.25rem] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] border border-border-color relative w-full hover:-translate-y-2 hover:shadow-[0_12px_30px_rgba(0,0,0,0.1)] max-sm:max-w-[420px] max-sm:mx-auto">
      <Link to={`/property/${property._id}`} className="no-underline text-inherit flex flex-col w-full">
        {/* Image Section */}
        <div className="relative h-[220px] overflow-hidden shrink-0">
          <img
            src={property.images[0] || 'https://via.placeholder.com/400x300?text=No+Image'}
            alt={property.title}
            className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
          />

          {/* Top Badges */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
            <div className="flex gap-2">
              {renderActions ? (
                <span className={`text-white px-3 py-1 rounded-full text-xs font-extrabold uppercase backdrop-blur shadow-[0_2px_8px_rgba(0,0,0,0.1)] ${property.status === 'sold' || property.status === 'rented' ? 'bg-[#64748b]' : 'bg-[#10b981]'}`}>
                  {property.status === 'sale' || property.status === 'rent' ? 'available' : property.status}
                </span>
              ) : (
                <span className="bg-white/90 px-3 py-1 rounded-full text-xs font-bold uppercase text-text-main backdrop-blur">New</span>
              )}
              <span className="bg-primary text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 uppercase">
                <HiShieldCheck size={14} /> Verified
              </span>
            </div>
            {(!user || user.role === 'buyer') && (
              <button
                className={`flex items-center justify-center w-8 h-8 rounded-full border-none cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-all duration-200 z-[15] hover:text-red-500 hover:scale-110 hover:bg-white ${isWishlisted ? 'text-red-500 bg-white' : 'text-[#64748b] bg-white/90'}`}
                onClick={handleWishlistClick}
              >
                {isWishlisted ? (
                  <HiHeart size={20} />
                ) : (
                  <HiOutlineHeart size={20} />
                )}
              </button>
            )}
          </div>

          {/* Price Overlay */}
          <div className="absolute bottom-0 left-0 right-0 pt-6 pb-3 px-4 bg-gradient-to-t from-black/70 to-transparent text-white">
            <h3 className="text-[1.5rem] font-extrabold m-0">
              {formattedPrice}
              {property.status === 'rent' && <span className="text-[0.875rem] font-normal">/mo</span>}
            </h3>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5 flex flex-col flex-1">
          <div className="flex justify-between items-center">
            <span className="text-[0.75rem] font-bold text-primary uppercase tracking-[0.05em]">
              {property.propertyType}
            </span>
            {property.views !== undefined && (
              <div className="flex items-center gap-[0.3rem] color-[#64748b] text-[0.8125rem] font-semibold">
                <HiEye size={16} /> {property.views}
              </div>
            )}
          </div>

          <h4 className="text-[1.125rem] font-bold mt-1 mb-2 text-text-main whitespace-nowrap overflow-hidden text-ellipsis min-h-[1.5rem]">
            {property.title}
          </h4>

          <div className="flex items-center gap-[0.4rem] text-text-muted text-[0.875rem] mb-4">
            <HiLocationMarker className="text-[#94a3b8] shrink-0" />
            <span className="whitespace-nowrap overflow-hidden text-ellipsis">
              {property.area}, {property.city}
            </span>
          </div>

          {/* Specs Grid */}
          <div className="grid grid-cols-[1fr_1fr_1fr] py-4 border-t border-[#f1f5f9] gap-2 mt-auto">
            {property.propertyType?.toLowerCase() === 'commercial' ? (
              <>
                <div className="text-center">
                  <div className="text-[#64748b] mb-1 flex justify-center"><HiOutlineHome size={20} /></div>
                  <div className="font-bold text-[0.9375rem] text-text-main">{property.status}</div>
                  <div className="text-[0.625rem] text-[#94a3b8] uppercase font-bold">Type</div>
                </div>
                <div className="text-center border-l border-r border-[#f1f5f9]">
                  <div className="text-[#64748b] mb-1 flex justify-center"><HiArrowsExpand size={20} /></div>
                  <div className="font-bold text-[0.9375rem] text-text-main">{property.areaSize}</div>
                  <div className="text-[0.625rem] text-[#94a3b8] uppercase font-bold">Sq Ft</div>
                </div>
                <div className="text-center">
                  <div className="text-[#64748b] mb-1 flex justify-center"><HiShieldCheck size={20} /></div>
                  <div className="font-bold text-[0.9375rem] text-text-main">OK</div>
                  <div className="text-[0.625rem] text-[#94a3b8] uppercase font-bold">Legal</div>
                </div>
              </>
            ) : (
              <>
                <div className="text-center">
                  <div className="text-[#64748b] mb-1 flex justify-center"><HiOutlineHome size={20} /></div>
                  <div className="font-bold text-[0.9375rem] text-text-main">{property.bhk}</div>
                  <div className="text-[0.625rem] text-[#94a3b8] uppercase font-bold">Beds</div>
                </div>
                <div className="text-center border-l border-r border-[#f1f5f9]">
                  <div className="text-[#64748b] mb-1 flex justify-center"><HiOutlineUserGroup size={20} /></div>
                  <div className="font-bold text-[0.9375rem] text-text-main">
                    {property.bathrooms || Math.max(1, parseInt(property.bhk) - 1 || 0)}
                  </div>
                  <div className="text-[0.625rem] text-[#94a3b8] uppercase font-bold">Baths</div>
                </div>
                <div className="text-center">
                  <div className="text-[#64748b] mb-1 flex justify-center"><HiArrowsExpand size={20} /></div>
                  <div className="font-bold text-[0.9375rem] text-text-main">{property.areaSize}</div>
                  <div className="text-[0.625rem] text-[#94a3b8] uppercase font-bold">Sq Ft</div>
                </div>
              </>
            )}
          </div>

          {/* View Details Action (Desktop/Default) */}
          {!renderActions && (
            <div className="mt-5">
              <button className="btn btn-primary w-full p-3 rounded-xl font-bold text-[0.9375rem]">
                View Details
              </button>
            </div>
          )}
        </div>
      </Link>

      {/* Custom Actions (Management) - OUTSIDE Link */}
      {renderActions && (
        <div className="px-5 pb-5 flex gap-2 relative z-20"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {renderActions(property)}
        </div>
      )}
    </div>
  );
};

export default PropertyCard;