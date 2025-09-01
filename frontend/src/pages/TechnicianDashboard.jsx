// frontend/src/pages/TechnicianDashboard.jsx

import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout'; // For the sidebar and overall layout
import api from '../api'; // For making authenticated API calls

const TechnicianDashboard = () => {
    // State variables for each form field
    const [patientName, setPatientName] = useState('');
    const [patientId, setPatientId] = useState('');
    const [scanType] = useState('RGB'); // Fixed value as per requirements
    const [region, setRegion] = useState('Frontal');
    const [scanImage, setScanImage] = useState(null);

    // State variables for UI feedback
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        setMessage(''); // Reset any previous messages
        setIsSubmitting(true);

        if (!scanImage) {
            setMessage('Please select an image to upload.');
            setIsSubmitting(false);
            return;
        }

        // Use FormData to package the form data and the image file
        const formData = new FormData();
        formData.append('patientName', patientName);
        formData.append('patientId', patientId);
        formData.append('scanType', scanType);
        formData.append('region', region);
        formData.append('scanImage', scanImage);

        try {
            // Use our custom 'api' instance to send the authenticated request
            await api.post('/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // On success, show a success message and reset the form
            setMessage('Scan uploaded successfully!');
            setPatientName('');
            setPatientId('');
            setRegion('Frontal');
            setScanImage(null);
            e.target.reset(); // This clears the file input field

        } catch (error) {
            setMessage('Upload failed. Please try again.');
            console.error('Upload error:', error);
        } finally {
            setIsSubmitting(false); // Re-enable the submit button
        }
    };

    return (
        <DashboardLayout title="Technician Dashboard">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800 mb-6">Upload New Patient Scan</h2>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Patient Name Input */}
                        <div>
                            <label htmlFor="patientName" className="block text-sm font-medium text-gray-700 mb-1">Patient Name</label>
                            <input
                                type="text"
                                id="patientName"
                                value={patientName}
                                onChange={(e) => setPatientName(e.target.value)}
                                required
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="E.g., John Doe"
                            />
                        </div>

                        {/* Patient ID Input */}
                        <div>
                            <label htmlFor="patientId" className="block text-sm font-medium text-gray-700 mb-1">Patient ID</label>
                            <input
                                type="text"
                                id="patientId"
                                value={patientId}
                                onChange={(e) => setPatientId(e.target.value)}
                                required
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="E.g., P12345"
                            />
                        </div>

                        {/* Scan Type (Read-only) */}
                        <div>
                            <label htmlFor="scanType" className="block text-sm font-medium text-gray-700 mb-1">Scan Type</label>
                            <input
                                type="text"
                                id="scanType"
                                value={scanType}
                                readOnly
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-gray-100 cursor-not-allowed text-gray-600"
                            />
                        </div>

                        {/* Region Select */}
                        <div>
                            <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-1">Region</label>
                            <select
                                id="region"
                                value={region}
                                onChange={(e) => setRegion(e.target.value)}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="Frontal">Frontal</option>
                                <option value="Upper Arch">Upper Arch</option>
                                <option value="Lower Arch">Lower Arch</option>
                            </select>
                        </div>

                        {/* File Input */}
                        <div>
                            <label htmlFor="scanImage" className="block text-sm font-medium text-gray-700 mb-1">Upload Scan Image (JPG/PNG)</label>
                            <input
                                type="file"
                                id="scanImage"
                                onChange={(e) => setScanImage(e.target.files[0])}
                                accept="image/jpeg, image/png"
                                required
                                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 transition-colors duration-200 cursor-pointer"
                            />
                        </div>

                        {/* Submit Button */}
                        <div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full py-2.5 px-4 font-semibold rounded-lg shadow-md transition-colors duration-200 ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                            >
                                {isSubmitting ? 'Uploading...' : 'Upload Scan'}
                            </button>
                        </div>
                    </form>

                    {/* Feedback Message */}
                    {message && (
                        <p className={`mt-4 text-center text-sm font-medium ${message.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
                            {message}
                        </p>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default TechnicianDashboard;