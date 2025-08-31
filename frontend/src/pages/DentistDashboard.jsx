import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import { useNavigate } from 'react-router-dom';

const DentistDashboard = () => {
    const [scans, setScans] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchScans = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/scans`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setScans(response.data.scans);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch scans", error);
                setLoading(false);
            }
        };
        fetchScans();
    }, []);
    
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleDownloadPDF = (scan) => {
        const doc = new jsPDF();

        doc.setFontSize(20);
        doc.text("OralVis Healthcare Scan Report", 10, 20);

        doc.setFontSize(12);
        doc.text(`Patient Name: ${scan.patientName}`, 10, 40);
        doc.text(`Patient ID: ${scan.patientId}`, 10, 50);
        doc.text(`Scan Type: ${scan.scanType}`, 10, 60);
        doc.text(`Region: ${scan.region}`, 10, 70);
        doc.text(`Upload Date: ${new Date(scan.uploadDate).toLocaleString()}`, 10, 80);
        
        // Note: Adding images from URLs can be tricky due to CORS. 
        // A backend proxy might be needed for some image URLs if CORS errors occur.
        // For Cloudinary, this usually works fine.
        const img = new Image();
        img.crossOrigin = "Anonymous"; // Important for CORS
        img.src = scan.imageUrl;
        img.onload = () => {
            // A4 page is 210mm wide. We'll make the image 180mm wide.
            const imgWidth = 150; 
            const imgHeight = (img.height * imgWidth) / img.width;
            doc.addImage(img, 'JPEG', 10, 90, imgWidth, imgHeight);
            doc.save(`report-${scan.patientId}.pdf`);
        };
        img.onerror = () => {
            alert("Could not load image for PDF. Please check CORS policy.");
        };
    };

    if (loading) {
        return <p>Loading scans...</p>;
    }

    return (
        <div>
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-gray-900">Dentist Dashboard - Scan Viewer</h1>
                     <button onClick={handleLogout} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700">Logout</button>
                </div>
            </header>
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {scans.map((scan) => (
                        <div key={scan.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                            <img src={scan.imageUrl} alt="Scan" className="w-full h-48 object-cover"/>
                            <div className="p-4">
                                <h3 className="text-lg font-bold">Patient: {scan.patientName}</h3>
                                <p className="text-sm text-gray-600">ID: {scan.patientId}</p>
                                <p className="mt-2 text-sm"><b>Type:</b> {scan.scanType}</p>
                                <p className="text-sm"><b>Region:</b> {scan.region}</p>
                                <p className="text-xs text-gray-500 mt-1"><b>Uploaded:</b> {new Date(scan.uploadDate).toLocaleDateString()}</p>
                                <div className="mt-4 flex space-x-2">
                                     <a href={scan.imageUrl} target="_blank" rel="noopener noreferrer" className="flex-1 text-center py-2 px-3 text-sm font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600">View Full Image</a>
                                     <button onClick={() => handleDownloadPDF(scan)} className="flex-1 py-2 px-3 text-sm font-semibold text-white bg-green-500 rounded-md hover:bg-green-600">Download Report</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default DentistDashboard;