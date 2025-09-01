// frontend/src/pages/DentistDashboard.jsx

import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import DashboardLayout from '../components/DashboardLayout'; // Import the layout
import api from '../api';

const DentistDashboard = () => {
    // ... (all your existing state and functions remain the same)
    const [scans, setScans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchScans = async () => {
            // ... (fetchScans logic is the same)
            try {
                const response = await api.get('/api/scans');
                setScans(response.data.scans);
            } catch (err) {
                setError("Failed to fetch scans. Please try again.");
                console.error("Failed to fetch scans", err);
            } finally {
                setLoading(false);
            }
        };
        fetchScans();
    }, []);
    
    const handleDownloadPDF = (scan) => {
        // ... (handleDownloadPDF logic is the same)
    };

    return (
        <DashboardLayout title="Dentist Scan Viewer">
            {loading && <div className="text-center py-10">Loading scans...</div>}
            {error && <div className="text-center py-10 text-red-600">{error}</div>}
            {!loading && scans.length === 0 && !error && (
                <div className="text-center py-10 text-gray-500">No scans have been uploaded yet.</div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {scans.map((scan) => (
                    // Your scan card JSX remains the same as before
                    <div key={scan.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 transition-transform duration-200 hover:scale-105 hover:shadow-lg">
                        <img src={scan.imageUrl} alt={`Scan for ${scan.patientName}`} className="w-full h-52 object-cover" />
                        <div className="p-4 space-y-2">
                           {/* ... content of the card ... */}
                           <h3 className="text-lg font-bold text-gray-800 truncate">{scan.patientName}</h3>
                           <p className="text-sm text-gray-600">ID: <span className="font-medium text-gray-900">{scan.patientId}</span></p>
                           {/* ... other details ... */}
                           <div className="mt-4 flex flex-col space-y-2">
                                <a href={scan.imageUrl} target="_blank" rel="noopener noreferrer" className="text-center py-2 px-3 text-sm font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors">View Full Image</a>
                                <button onClick={() => handleDownloadPDF(scan)} className="py-2 px-3 text-sm font-semibold text-white bg-green-500 rounded-lg hover:bg-green-600 transition-colors">Download Report</button>
                           </div>
                        </div>
                    </div>
                ))}
            </div>
        </DashboardLayout>
    );
};

export default DentistDashboard;