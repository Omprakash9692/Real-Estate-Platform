import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { HiUpload, HiCheckCircle, HiHome, HiCurrencyDollar, HiLocationMarker, HiX } from "react-icons/hi";
import API_URL from "../config";

const EditProperty = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [existingImages, setExistingImages] = useState([]);
    const [newImages, setNewImages] = useState([]);
    const [newImagePreviews, setNewImagePreviews] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        city: '',
        area: '',
        pincode: '',
        propertyType: 'flat',
        bhk: '',
        areaSize: '',
        furnishing: 'unfurnished',
        status: 'sale',
        amenities: [],
        securityDeposit: '',
        maintenance: ''
    });

    const commonAmenities = ["Parking", "Pool", "Gym", "Security", "Wifi", "Power Backup", "Club House", "Garden"];

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/property/${id}`);
                const p = res.data.property;
                setFormData({
                    title: p.title || '',
                    description: p.description || '',
                    price: p.price || '',
                    city: p.city || '',
                    area: p.area || '',
                    pincode: p.pincode || '',
                    propertyType: p.propertyType || 'flat',
                    bhk: p.bhk || '',
                    areaSize: p.areaSize || '',
                    furnishing: p.furnishing || 'unfurnished',
                    status: p.status || 'sale',
                    amenities: p.amenities || [],
                    securityDeposit: p.securityDeposit || '',
                    maintenance: p.maintenance || ''
                });
                setExistingImages(p.images || []);
                setLoading(false);
            } catch (err) {
                setError('Failed to load property details.');
                setLoading(false);
            }
        };
        fetchProperty();
    }, [id]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAmenityChange = (amenity) => {
        setFormData(prev => {
            const current = prev.amenities || [];
            if (current.includes(amenity)) {
                return { ...prev, amenities: current.filter(a => a !== amenity) };
            } else {
                return { ...prev, amenities: [...current, amenity] };
            }
        });
    };

    const handleNewImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (existingImages.length + newImages.length + files.length > 10) {
            setError("Total images cannot exceed 10.");
            return;
        }
        setNewImages(prev => [...prev, ...files]);

        const previews = files.map(file => URL.createObjectURL(file));
        setNewImagePreviews(prev => [...prev, ...previews]);
    };

    const removeExistingImage = (url) => {
        setExistingImages(existingImages.filter(img => img !== url));
    };

    const removeNewImage = (index) => {
        setNewImages(newImages.filter((_, i) => i !== index));
        setNewImagePreviews(newImagePreviews.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (key === 'amenities') {
                data.append('amenities', JSON.stringify(formData[key]));
            } else if (key === 'securityDeposit' || key === 'maintenance') {
                data.append(key, formData[key] || 0);
            } else {
                data.append(key, formData[key]);
            }
        });
        data.append('existingImages', JSON.stringify(existingImages));
        newImages.forEach(img => data.append('images', img));

        try {
            await axios.put(`${API_URL}/api/property/${id}`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update property.');
            setSubmitting(false);
        }
    };

    if (loading) return <div className="loader-full-page"><div className="loader"></div></div>;

    return (
        <div className="fade-in dashboard-content" style={{ padding: '1rem', width: '100%', margin: '0 auto' }}>
            <div style={{ maxWidth: '900px', width: '100%', margin: '0 auto' }}>
                <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
                    <h1 style={{ fontSize: 'clamp(1.75rem, 5vw, 2.5rem)', marginBottom: '1rem', color: 'var(--text-main)' }}>Edit Property</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Update your property details and manage images.</p>
                </div>

                <form onSubmit={handleSubmit} className="card-premium" style={{ padding: 'var(--card-padding, 2.5rem)' }}>
                    {error && <div style={{ padding: '1rem', background: '#fee2e2', color: '#dc2626', borderRadius: '0.75rem', marginBottom: '2rem' }}>{error}</div>}

                    {/* Section 1: Basic Information */}
                    <div style={{ marginBottom: '3rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                            <div style={{ width: '4px', height: '24px', background: 'var(--primary)', borderRadius: '2px' }}></div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>Content & Description</h3>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.6rem', fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)' }}>Property Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Luxury 3BHK Apartment in Downtown"
                                    style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', outline: 'none', background: '#fff', fontSize: '0.9375rem' }}
                                    required
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.6rem', fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)' }}>Detailed Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Describe the property highlights..."
                                    style={{ width: '100%', height: '120px', padding: '0.875rem 1rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', outline: 'none', resize: 'none', background: '#fff', fontSize: '0.9375rem', lineHeight: '1.5' }}
                                    required
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    <div className="add-prop-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
                        {/* Section 2: Property Details */}
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                                <div style={{ width: '4px', height: '24px', background: 'var(--primary)', borderRadius: '2px' }}></div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>Property Details</h3>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)' }}>Property Type</label>
                                    <select name="propertyType" value={formData.propertyType} onChange={handleInputChange} style={{ width: '100%', padding: '0.875rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', outline: 'none', background: '#fff', cursor: 'pointer' }}>
                                        <option value="flat">Flat/Apartment</option>
                                        <option value="villa">Independent House/Villa</option>
                                        <option value="penthouse">Penthouse</option>
                                        <option value="commercial">Commercial</option>
                                    </select>
                                </div>
                                <div className="row-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)' }}>BHK</label>
                                        <input type="number" name="bhk" value={formData.bhk} onChange={handleInputChange} placeholder="e.g. 3" style={{ width: '100%', padding: '0.875rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', outline: 'none' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)' }}>Area (Sq.Ft)</label>
                                        <input type="number" name="areaSize" value={formData.areaSize} onChange={handleInputChange} placeholder="e.g. 1500" style={{ width: '100%', padding: '0.875rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', outline: 'none' }} required />
                                    </div>
                                </div>
                                <div className="row-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)' }}>Furnishing</label>
                                        <select name="furnishing" value={formData.furnishing} onChange={handleInputChange} style={{ width: '100%', padding: '0.875rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', outline: 'none', background: '#fff' }}>
                                            <option value="unfurnished">Unfurnished</option>
                                            <option value="semi-furnished">Semi-Furnished</option>
                                            <option value="furnished">Fully Furnished</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)' }}>Listing Status</label>
                                        <select name="status" value={formData.status} onChange={handleInputChange} style={{ width: '100%', padding: '0.875rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', outline: 'none', background: '#fff' }}>
                                            <option value="sale">For Sale</option>
                                            <option value="rent">For Rent</option>
                                            <option value="sold">Sold</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Pricing & Location */}
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                                <div style={{ width: '4px', height: '24px', background: 'var(--primary)', borderRadius: '2px' }}></div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>Pricing & Location</h3>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)' }}>
                                        {formData.status === 'rent' ? 'Monthly Rent (₹)' : 'Price (₹)'}
                                    </label>
                                    <input type="number" name="price" value={formData.price} onChange={handleInputChange} placeholder={formData.status === 'rent' ? 'e.g. 15000' : 'e.g. 5000000'} style={{ width: '100%', padding: '0.875rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', outline: 'none' }} required />
                                </div>

                                {formData.status === 'rent' && (
                                    <div className="row-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)' }}>Security Deposit (₹)</label>
                                            <input type="number" name="securityDeposit" value={formData.securityDeposit} onChange={handleInputChange} placeholder="e.g. 30000" style={{ width: '100%', padding: '0.875rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', outline: 'none' }} />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)' }}>Maintenance (₹/month)</label>
                                            <input type="number" name="maintenance" value={formData.maintenance} onChange={handleInputChange} placeholder="e.g. 1500" style={{ width: '100%', padding: '0.875rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', outline: 'none' }} />
                                        </div>
                                    </div>
                                )}

                                <div className="row-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)' }}>City</label>
                                        <input type="text" name="city" value={formData.city} onChange={handleInputChange} placeholder="e.g. Mumbai" style={{ width: '100%', padding: '0.875rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', outline: 'none' }} required />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)' }}>Pincode</label>
                                        <input type="text" name="pincode" value={formData.pincode} onChange={handleInputChange} placeholder="e.g. 400001" style={{ width: '100%', padding: '0.875rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', outline: 'none' }} required />
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)' }}>Specific Area</label>
                                    <input type="text" name="area" value={formData.area} onChange={handleInputChange} placeholder="e.g. Worli" style={{ width: '100%', padding: '0.875rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', outline: 'none' }} required />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 4: Amenities */}
                    <div style={{ marginBottom: '3rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div style={{ width: '4px', height: '24px', background: 'var(--primary)', borderRadius: '2px' }}></div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>Amenities</h3>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
                            {commonAmenities.map(amenity => (
                                <label key={amenity} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', padding: '0.75rem', borderRadius: '0.75rem', background: formData.amenities.includes(amenity) ? 'var(--primary-light)' : '#f8fafc', border: formData.amenities.includes(amenity) ? '1px solid var(--primary)' : '1px solid #e2e8f0', transition: 'all 0.2s' }}>
                                    <input
                                        type="checkbox"
                                        checked={formData.amenities.includes(amenity)}
                                        onChange={() => handleAmenityChange(amenity)}
                                        style={{ accentColor: 'var(--primary)', width: '18px', height: '18px' }}
                                    />
                                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: formData.amenities.includes(amenity) ? 'var(--primary)' : 'var(--text-main)' }}>{amenity}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Section 4: Image Management */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div style={{ width: '4px', height: '24px', background: 'var(--primary)', borderRadius: '2px' }}></div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>Image Management</h3>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '1rem' }}>
                            {/* Existing Images */}
                            {existingImages.map((src, i) => (
                                <div key={`existing-${i}`} style={{ position: 'relative', aspectRatio: '1', borderRadius: '0.75rem', overflow: 'hidden', border: '2px solid #f1f5f9' }}>
                                    <img src={src} alt="Existing" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    <button
                                        type="button"
                                        onClick={() => removeExistingImage(src)}
                                        style={{ position: 'absolute', top: '5px', right: '5px', background: '#dc2626', color: 'white', border: 'none', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10 }}
                                    >
                                        <HiX size={12} />
                                    </button>
                                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'var(--primary)', color: 'white', fontSize: '0.6rem', textAlign: 'center', padding: '2px 0', fontWeight: 700, letterSpacing: '0.05em' }}>EXISTING</div>
                                </div>
                            ))}

                            {/* New Image Previews */}
                            {newImagePreviews.map((src, i) => (
                                <div key={`new-${i}`} style={{ position: 'relative', aspectRatio: '1', borderRadius: '0.75rem', overflow: 'hidden', border: '2px dashed var(--primary)' }}>
                                    <img src={src} alt="New Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    <button
                                        type="button"
                                        onClick={() => removeNewImage(i)}
                                        style={{ position: 'absolute', top: '5px', right: '5px', background: '#dc2626', color: 'white', border: 'none', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10 }}
                                    >
                                        <HiX size={12} />
                                    </button>
                                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: '#10b981', color: 'white', fontSize: '0.6rem', textAlign: 'center', padding: '2px 0', fontWeight: 700, letterSpacing: '0.05em' }}>NEW</div>
                                </div>
                            ))}

                            {/* Upload Button overlay */}
                            {(existingImages.length + newImages.length) < 10 && (
                                <div style={{
                                    aspectRatio: '1',
                                    border: '2px dashed #cbd5e1',
                                    borderRadius: '0.75rem',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    position: 'relative',
                                    background: '#f8fafc',
                                    transition: 'border-color 0.2s'
                                }} onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--primary)'} onMouseOut={(e) => e.currentTarget.style.borderColor = '#cbd5e1'}>
                                    <input
                                        type="file"
                                        multiple
                                        onChange={handleNewImageChange}
                                        style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
                                        accept="image/*"
                                    />
                                    <HiUpload size={22} color="#64748b" />
                                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginTop: '0.4rem' }}>Add Image</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '1.25rem', borderTop: '1px solid #f1f5f9', paddingTop: '2.5rem' }}>
                        <button type="button" onClick={() => navigate('/dashboard')} className="btn btn-outline" style={{ padding: '0.875rem 2.5rem', fontWeight: 700, minWidth: '140px' }}>Cancel</button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ padding: '0.875rem 3rem', fontWeight: 700, minWidth: '180px' }}
                            disabled={submitting}
                        >
                            {submitting ? 'Updating...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
            <style>{`
                @media (max-width: 768px) {
                    .card-premium {
                        padding: 1.5rem !important;
                    }
                    .add-prop-grid {
                        grid-template-columns: 1fr !important;
                        gap: 1.5rem !important;
                    }
                    .row-grid-2 {
                        grid-template-columns: 1fr !important;
                        gap: 1rem !important;
                    }
                }
                @media (max-width: 480px) {
                    .card-premium {
                        padding: 1rem !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default EditProperty;
