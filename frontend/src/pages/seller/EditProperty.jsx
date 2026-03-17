import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { HiUpload, HiCheckCircle, HiHome, HiCurrencyDollar, HiLocationMarker, HiX } from "react-icons/hi";
import API_URL from "../../config";
import { useAuth } from "../../context/AuthContext";

const EditProperty = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();
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
        bathrooms: '',
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
                    bathrooms: p.bathrooms || '',
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
                    Authorization: `Bearer ${token}`
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
        <div className="fade-in px-4 py-8 md:py-12 w-full mx-auto dashboard-content">
            <div className="max-w-[900px] w-full mx-auto">
                <div className="mb-12 text-center">
                    <h1 className="text-[clamp(1.75rem,5vw,2.5rem)] mb-4 text-text-main font-extrabold">Edit Property</h1>
                    <p className="text-text-muted text-base">Update your property details and manage images.</p>
                </div>

                <form onSubmit={handleSubmit} className="card-premium p-6 md:p-10">
                    {error && <div style={{ padding: '1rem', background: '#fee2e2', color: '#dc2626', borderRadius: '0.75rem', marginBottom: '2rem' }}>{error}</div>}

                    {/* Section 1: Basic Information */}
                    <div className="mb-12">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-1 h-6 bg-primary rounded-sm"></div>
                            <h3 className="text-xl font-extrabold text-text-main">Content & Description</h3>
                        </div>
                        <div className="flex flex-col gap-6">
                            <div>
                                <label className="block mb-2.5 text-sm font-bold text-text-main">Property Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Luxury 3BHK Apartment in Downtown"
                                    className="w-full py-3.5 px-4 rounded-xl border border-[#e2e8f0] outline-none bg-white text-[0.9375rem] focus:border-primary transition-colors"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block mb-2.5 text-sm font-bold text-text-main">Detailed Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Describe the property highlights..."
                                    className="w-full h-[120px] py-3.5 px-4 rounded-xl border border-[#e2e8f0] outline-none resize-none bg-white text-[0.9375rem] leading-relaxed focus:border-primary transition-colors"
                                    required
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-8 mb-12">
                        {/* Section 2: Property Details */}
                        <div>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-1 h-6 bg-primary rounded-sm"></div>
                                <h3 className="text-xl font-extrabold text-text-main">Property Details</h3>
                            </div>
                            <div className="flex flex-col gap-5">
                                <div>
                                    <label className="block mb-2 text-sm font-bold text-text-main">Property Type</label>
                                    <select name="propertyType" value={formData.propertyType} onChange={handleInputChange} className="w-full p-3.5 rounded-xl border border-[#e2e8f0] outline-none bg-white cursor-pointer focus:border-primary transition-colors">
                                        <option value="flat">Flat/Apartment</option>
                                        <option value="villa">Independent House/Villa</option>
                                        <option value="penthouse">Penthouse</option>
                                        <option value="commercial">Commercial</option>
                                    </select>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block mb-2 text-sm font-bold text-text-main">BHK</label>
                                        <input type="number" name="bhk" value={formData.bhk} onChange={handleInputChange} placeholder="e.g. 3" className="w-full p-3.5 rounded-xl border border-[#e2e8f0] outline-none focus:border-primary transition-colors" />
                                    </div>
                                    <div>
                                        <label className="block mb-2 text-sm font-bold text-text-main">Bathrooms</label>
                                        <input type="number" name="bathrooms" value={formData.bathrooms || ''} onChange={handleInputChange} placeholder="e.g. 2" className="w-full p-3.5 rounded-xl border border-[#e2e8f0] outline-none focus:border-primary transition-colors" />
                                    </div>
                                    <div>
                                        <label className="block mb-2 text-sm font-bold text-text-main">Area (Sq.Ft)</label>
                                        <input type="number" name="areaSize" value={formData.areaSize} onChange={handleInputChange} placeholder="e.g. 1500" className="w-full p-3.5 rounded-xl border border-[#e2e8f0] outline-none focus:border-primary transition-colors" required />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block mb-2 text-sm font-bold text-text-main">Furnishing</label>
                                        <select name="furnishing" value={formData.furnishing} onChange={handleInputChange} className="w-full p-3.5 rounded-xl border border-[#e2e8f0] outline-none bg-white focus:border-primary transition-colors">
                                            <option value="unfurnished">Unfurnished</option>
                                            <option value="semi-furnished">Semi-Furnished</option>
                                            <option value="furnished">Fully Furnished</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block mb-2 text-sm font-bold text-text-main">Listing Status</label>
                                        <select name="status" value={formData.status} onChange={handleInputChange} className="w-full p-3.5 rounded-xl border border-[#e2e8f0] outline-none bg-white focus:border-primary transition-colors">
                                            <option value="sale">For Sale</option>
                                            <option value="sold">Sold</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Pricing & Location */}
                        <div>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-1 h-6 bg-primary rounded-sm"></div>
                                <h3 className="text-xl font-extrabold text-text-main">Pricing & Location</h3>
                            </div>
                            <div className="flex flex-col gap-5">
                                <div>
                                    <label className="block mb-2 text-sm font-bold text-text-main">
                                        Price (₹)
                                    </label>
                                    <input type="number" name="price" value={formData.price} onChange={handleInputChange} placeholder="e.g. 5000000" className="w-full p-3.5 rounded-xl border border-[#e2e8f0] outline-none focus:border-primary transition-colors" required />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block mb-2 text-sm font-bold text-text-main">City</label>
                                        <input type="text" name="city" value={formData.city} onChange={handleInputChange} placeholder="e.g. Mumbai" className="w-full p-3.5 rounded-xl border border-[#e2e8f0] outline-none focus:border-primary transition-colors" required />
                                    </div>
                                    <div>
                                        <label className="block mb-2 text-sm font-bold text-text-main">Pincode</label>
                                        <input type="text" name="pincode" value={formData.pincode} onChange={handleInputChange} placeholder="e.g. 400001" className="w-full p-3.5 rounded-xl border border-[#e2e8f0] outline-none focus:border-primary transition-colors" required />
                                    </div>
                                </div>
                                <div>
                                    <label className="block mb-2 text-sm font-bold text-text-main">Specific Area</label>
                                    <input type="text" name="area" value={formData.area} onChange={handleInputChange} placeholder="e.g. Worli" className="w-full p-3.5 rounded-xl border border-[#e2e8f0] outline-none focus:border-primary transition-colors" required />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 4: Amenities */}
                    <div className="mb-12">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-1 h-6 bg-primary rounded-sm"></div>
                            <h3 className="text-xl font-extrabold text-text-main">Amenities</h3>
                        </div>
                        <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-4">
                            {commonAmenities.map(amenity => (
                                <label key={amenity} className={`flex items-center gap-3 cursor-pointer p-3 rounded-xl border transition-all duration-200 ${formData.amenities.includes(amenity) ? 'bg-primary-light border-primary' : 'bg-[#f8fafc] border-[#e2e8f0]'}`}>
                                    <input
                                        type="checkbox"
                                        checked={formData.amenities.includes(amenity)}
                                        onChange={() => handleAmenityChange(amenity)}
                                        className="accent-primary w-4 h-4"
                                    />
                                    <span className={`text-sm font-semibold ${formData.amenities.includes(amenity) ? 'text-primary' : 'text-text-main'}`}>{amenity}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Section 4: Image Management */}
                    <div className="mb-6">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-1 h-6 bg-primary rounded-sm"></div>
                            <h3 className="text-xl font-extrabold text-text-main">Image Management</h3>
                        </div>

                        <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-4">
                            {/* Existing Images */}
                            {existingImages.map((src, i) => (
                                <div key={`existing-${i}`} className="relative aspect-square rounded-xl overflow-hidden border-2 border-[#f1f5f9]">
                                    <img src={src} alt="Existing" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeExistingImage(src)}
                                        className="absolute top-1 right-1 bg-[#dc2626] text-white border-none rounded-full w-5 h-5 flex items-center justify-center cursor-pointer z-10"
                                    >
                                        <HiX size={12} />
                                    </button>
                                    <div className="absolute bottom-0 left-0 right-0 bg-primary text-white text-[0.6rem] text-center py-0.5 font-bold tracking-widest">EXISTING</div>
                                </div>
                            ))}

                            {/* New Image Previews */}
                            {newImagePreviews.map((src, i) => (
                                <div key={`new-${i}`} className="relative aspect-square rounded-xl overflow-hidden border-2 border-dashed border-primary">
                                    <img src={src} alt="New Preview" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeNewImage(i)}
                                        className="absolute top-1 right-1 bg-[#dc2626] text-white border-none rounded-full w-5 h-5 flex items-center justify-center cursor-pointer z-10"
                                    >
                                        <HiX size={12} />
                                    </button>
                                    <div className="absolute bottom-0 left-0 right-0 bg-[#10b981] text-white text-[0.6rem] text-center py-0.5 font-bold tracking-widest">NEW</div>
                                </div>
                            ))}

                            {/* Upload Button overlay */}
                            {(existingImages.length + newImages.length) < 10 && (
                                <div className="aspect-square border-2 border-dashed border-[#cbd5e1] rounded-xl flex flex-col items-center justify-center cursor-pointer relative bg-[#f8fafc] transition-colors hover:border-primary">
                                    <input
                                        type="file"
                                        multiple
                                        onChange={handleNewImageChange}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        accept="image/*"
                                    />
                                    <HiUpload size={22} color="#64748b" />
                                    <span className="text-xs font-bold text-[#64748b] mt-1.5">Add Image</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-12 flex justify-center flex-wrap gap-5 border-t border-[#f1f5f9] pt-10">
                        <button type="button" onClick={() => navigate('/dashboard')} className="btn btn-outline py-3.5 px-10 font-bold min-w-[140px]">Cancel</button>
                        <button
                            type="submit"
                            className="btn btn-primary py-3.5 px-12 font-bold min-w-[180px]"
                            disabled={submitting}
                        >
                            {submitting ? 'Updating...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>

        </div>
    );
};

export default EditProperty;
