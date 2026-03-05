import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { lawyerService } from '../../services/lawyerService';
import { FiSave, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import './ProfileEditor.css';

const ProfileEditor = () => {
    const { user, userProfile } = useAuth();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        displayName: userProfile?.displayName || '',
        specialty: userProfile?.specialty || '',
        title: userProfile?.title || 'Advocate',
        bio: userProfile?.bio || '',
        experience: userProfile?.experience || '',
        education: userProfile?.education || '',
        languages: userProfile?.languages || 'Nepali, English',
        office: userProfile?.office || '',
        phone: userProfile?.phone || '',
        website: userProfile?.website || ''
    });

    useEffect(() => {
        if (userProfile) {
            setFormData(prev => ({
                ...prev,
                displayName: userProfile.displayName || '',
                specialty: userProfile.specialty || '',
                bio: userProfile.bio || '',
                experience: userProfile.experience || '',
                education: userProfile.education || '',
                office: userProfile.office || '',
                phone: userProfile.phone || '',
                website: userProfile.website || ''
            }));
        }
    }, [userProfile]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(false);
        setError(null);

        try {
            // In a real app, we would update both the 'users' collection 
            // and potentially a 'lawyers' collection for public listing.
            await lawyerService.updateLawyerProfile(user.uid, formData);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            setError('Failed to update profile. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="profile-editor">
            <h2 className="dashboard-content__title">Edit Professional Profile</h2>

            {success && (
                <div className="status-message success">
                    <FiCheckCircle /> Profile updated successfully!
                </div>
            )}

            {error && (
                <div className="status-message error">
                    <FiAlertCircle /> {error}
                </div>
            )}

            <form className="editor-form" onSubmit={handleSubmit}>
                <div className="editor-section">
                    <h3>Basic Information</h3>
                    <div className="editor-grid">
                        <div className="form-group">
                            <label>Full Name</label>
                            <input name="displayName" value={formData.displayName} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Professional Title</label>
                            <input name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Senior Advocate" />
                        </div>
                        <div className="form-group">
                            <label>Primary Specialty</label>
                            <select name="specialty" value={formData.specialty} onChange={handleChange} required>
                                <option value="">Select Specialty</option>
                                <option value="Family Law">Family Law</option>
                                <option value="Criminal Defense">Criminal Defense</option>
                                <option value="Business Law">Business Law</option>
                                <option value="Real Estate">Real Estate</option>
                                <option value="Civil Litigation">Civil Litigation</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Years of Experience</label>
                            <input name="experience" value={formData.experience} onChange={handleChange} placeholder="e.g. 15 years" />
                        </div>
                    </div>
                </div>

                <div className="editor-section">
                    <h3>Professional Background</h3>
                    <div className="form-group">
                        <label>Short Biography</label>
                        <textarea name="bio" value={formData.bio} onChange={handleChange} rows="4" placeholder="Describe your legal background and approach..." />
                    </div>
                    <div className="form-group">
                        <label>Education</label>
                        <textarea name="education" value={formData.education} onChange={handleChange} rows="2" placeholder="e.g. LLM from Tribhuvan University" />
                    </div>
                </div>

                <div className="editor-section">
                    <h3>Contact & Location</h3>
                    <div className="editor-grid">
                        <div className="form-group">
                            <label>Office Address</label>
                            <input name="office" value={formData.office} onChange={handleChange} placeholder="e.g. Bagbazar, Kathmandu" />
                        </div>
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input name="phone" value={formData.phone} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Website (optional)</label>
                            <input name="website" value={formData.website} onChange={handleChange} placeholder="https://..." />
                        </div>
                    </div>
                </div>

                <div className="editor-actions">
                    <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                        <FiSave /> {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProfileEditor;
