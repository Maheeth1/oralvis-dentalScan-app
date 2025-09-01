// frontend/src/pages/DentistDashboard.jsx

import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import DashboardLayout from '../components/DashboardLayout'; // Provides sidebar and layout
import api from '../api'; // For authenticated API calls

const DentistDashboard = () => {
    // State for storing the list of scans, loading status, and any errors
    const [scans, setScans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch scans from the backend when the component first loads
    useEffect(() => {
        const fetchScans = async () => {
            try {
                const response = await api.get('/api/scans');
                setScans(response.data.scans);
            } catch (err) {
                setError("Failed to fetch scans. Please try again.");
                console.error("Failed to fetch scans", err);
            } finally {
                setLoading(false); // Stop loading once the request is complete
            }
        };
        fetchScans();
    }, []); // The empty dependency array ensures this runs only once
    
    // Function to generate and download a PDF report for a specific scan
    const handleDownloadPDF = async (scan) => {
        const doc = new jsPDF();

        // Add report title and patient details
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(20);
        doc.setTextColor('#1F2937'); // Dark Gray
        doc.text("OralVis Scan Report", 15, 20);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(12);
        doc.text(`Patient Name: ${scan.patientName}`, 15, 40);
        doc.text(`Patient ID: ${scan.patientId}`, 15, 50);
        doc.text(`Scan Type: ${scan.scanType}`, 15, 60);
        doc.text(`Region: ${scan.region}`, 15, 70);
        doc.text(`Upload Date: ${new Date(scan.uploadDate).toLocaleString()}`, 15, 80);

        try {
            // Fetch the image from Cloudinary to avoid browser security issues
            const response = await fetch(scan.imageUrl);
            const blob = await response.blob();

            // Convert the fetched image (blob) into a base64 string
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => {
                const base64data = reader.result;

                // Add the image to the PDF, calculating its size to fit the page
                const imgProps = doc.getImageProperties(base64data);
                const pdfWidth = doc.internal.pageSize.getWidth();
                const margin = 15;
                const imgWidth = pdfWidth - margin * 2;
                const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
                
                doc.addImage(base64data, 'JPEG', margin, 90, imgWidth, imgHeight);

                // Trigger the browser to download the PDF
                doc.save(`report-${scan.patientId}.pdf`);
            };
        } catch (error) {
            console.error("Error creating PDF:", error);
            alert("Failed to create PDF. Could not fetch image data for the report.");
        }
    };

    // Render the main component
    return (
        <DashboardLayout title="Dentist Scan Viewer">
            {/* Conditional rendering based on the loading and error states */}
            {loading && <div className="text-center py-10 text-gray-600">Loading scans...</div>}
            
            {error && <div className="text-center py-10 text-red-600 font-medium">{error}</div>}
            
            {!loading && scans.length === 0 && !error && (
                <div className="text-center py-10 text-gray-500">No scans have been uploaded yet.</div>
            )}

            {/* Grid container for the scan cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {scans.map((scan) => (
                    <div key={scan.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 transition-transform duration-200 hover:scale-105 hover:shadow-lg">
                        {/* Scan Image */}
                        <img src={scan.imageUrl} alt={`Scan for ${scan.patientName}`} className="w-full h-52 object-cover bg-gray-100" />
                        
                        {/* Card Content */}
                        <div className="p-4 space-y-2">
                           <h3 className="text-lg font-bold text-gray-800 truncate">{scan.patientName}</h3>
                           <p className="text-sm text-gray-600">ID: <span className="font-medium text-gray-900">{scan.patientId}</span></p>
                           <p className="text-sm text-gray-600">Region: <span className="font-medium text-gray-900">{scan.region}</span></p>
                           <p className="text-xs text-gray-500 pt-2 border-t border-gray-100 mt-2">
                                Uploaded: {new Date(scan.uploadDate).toLocaleDateString()}
                           </p>
                           
                           {/* Action Buttons */}
                           <div className="pt-2 flex flex-col space-y-2">
                                <a 
                                    href={scan.imageUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="text-center py-2 px-3 text-sm font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    View Full Image
                                </a>
                                <button 
                                    onClick={() => handleDownloadPDF(scan)} 
                                    className="py-2 px-3 text-sm font-semibold text-white bg-green-500 rounded-lg hover:bg-green-600 transition-colors"
                                >
                                    Download Report
                                </button>
                           </div>
                        </div>
                    </div>
                ))}
            </div>
        </DashboardLayout>
    );
};

export default DentistDashboard;