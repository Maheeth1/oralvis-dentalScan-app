import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TechnicianDashboard = () => {
    const [patientName, setPatientName] = useState('');
    const [patientId, setPatientId] = useState('');
    const [scanType] = useState('RGB'); // Fixed as per requirement
    const [region, setRegion] = useState('Frontal');
    const [scanImage, setScanImage] = useState(null);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        if (!scanImage) {
            setMessage('Please select an image to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('patientName', patientName);
        formData.append('patientId', patientId);
        formData.append('scanType', scanType);
        formData.append('region', region);
        formData.append('scanImage', scanImage);

        try {
            const token = localStorage.getItem('token');
            await axios.post(`${import.meta.env.VITE_API_URL}/api/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                },
            });
            setMessage('Scan uploaded successfully!');
            // Clear form
            setPatientName('');
            setPatientId('');
            setRegion('Frontal');
            setScanImage(null);
            e.target.reset(); // Reset file input
        } catch (error) {
            setMessage('Upload failed. Please try again.');
            console.error(error);
        }
    };

    return (
        <div>
             <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-gray-900">Technician Dashboard</h1>
                    <button onClick={handleLogout} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700">Logout</button>
                </div>
            </header>
            <main className="max-w-4xl mx-auto p-8">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold mb-4">Upload Patient Scan</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium">Patient Name</label>
                            <input type="text" value={patientName} onChange={(e) => setPatientName(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Patient ID</label>
                            <input type="text" value={patientId} onChange={(e) => setPatientId(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"/>
                        </div>
                         <div>
                            <label className="block text-sm font-medium">Scan Type</label>
                            <input type="text" value={scanType} readOnly className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-100"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Region</label>
                            <select value={region} onChange={(e) => setRegion(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                                <option>Frontal</option>
                                <option>Upper Arch</option>
                                <option>Lower Arch</option>
                            </select>
                        </div>
                        <div>
                             <label className="block text-sm font-medium">Upload Scan Image (JPG/PNG)</label>
                             <input type="file" onChange={(e) => setScanImage(e.target.files[0])} accept="image/jpeg, image/png" required className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"/>
                        </div>
                        <button type="submit" className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700">Upload Scan</button>
                    </form>
                    {message && <p className="mt-4 text-center text-sm font-medium text-gray-700">{message}</p>}
                </div>
            </main>
        </div>
    );
};

export default TechnicianDashboard;