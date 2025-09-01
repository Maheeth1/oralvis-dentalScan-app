// frontend/src/pages/TechnicianDashboard.jsx

import React, { useState } from 'react';
import axios from 'axios';
import DashboardLayout from '../components/DashboardLayout'; // Import the layout
import api from '../api';

const TechnicianDashboard = () => {
    // ... (all your existing state logic remains the same)
    const [patientName, setPatientName] = useState('');
    const [patientId, setPatientId] = useState('');
    const [scanType] = useState('RGB');
    const [region, setRegion] = useState('Frontal');
    const [scanImage, setScanImage] = useState(null);
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        // ... (your existing handleSubmit function remains exactly the same)
        e.preventDefault();
        setMessage('');
        setIsSubmitting(true);
        if (!scanImage) {
            setMessage('Please select an image to upload.');
            setIsSubmitting(false);
            return;
        }
        const formData = new FormData();
        formData.append('patientName', patientName);
        formData.append('patientId', patientId);
        formData.append('scanType', scanType);
        formData.append('region', region);
        formData.append('scanImage', scanImage);
        try {
            await api.post('/api/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setMessage('Scan uploaded successfully!');
            setPatientName('');
            setPatientId('');
            setRegion('Frontal');
            setScanImage(null);
            e.target.reset();
        } catch (error) {
            setMessage('Upload failed. Please try again.');
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <DashboardLayout title="Technician Dashboard">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800 mb-6">Upload New Patient Scan</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Your form fields (inputs, selects, etc.) go here */}
                        {/* This part of the code remains the same as before */}
                        <div>
                            <label htmlFor="patientName" className="block text-sm font-medium text-gray-700 mb-1">Patient Name</label>
                            <input type="text" id="patientName" value={patientName} onChange={(e) => setPatientName(e.target.value)} required 
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="E.g., John Doe"
                            />
                        </div>
                        {/* ... other form fields ... */}
                        <div>
                            <button type="submit" disabled={isSubmitting} 
                                className={`w-full py-2.5 px-4 font-semibold rounded-lg shadow-md transition-colors duration-200 ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}>
                                {isSubmitting ? 'Uploading...' : 'Upload Scan'}
                            </button>
                        </div>
                    </form>
                    {message && (
                        <p className={`mt-4 text-center text-sm font-medium ${message.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>{message}</p>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default TechnicianDashboard;