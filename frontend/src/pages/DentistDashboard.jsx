import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import { motion, AnimatePresence } from 'framer-motion';
import { DocumentArrowDownIcon, EyeIcon, CalendarDaysIcon, MapPinIcon } from '@heroicons/react/24/outline';
import api from '../api'; // 1. CRITICAL: Import 'api' from '../api', NOT 'axios'

const DentistDashboard = () => {
    const [scans, setScans] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchScans = async () => {
            try {
                // 2. CRITICAL: Use the 'api' instance for the request
                const response = await api.get('/api/scans');
                setScans(response.data.scans);
            } catch (error) {
                // This is where your console error is coming from
                console.error("Failed to fetch scans", error);
            } finally {
                setLoading(false);
            }
        };
        fetchScans();
    }, []);

    const handleDownloadPDF = (scan) => {
        // ... The PDF generation logic remains the same ...
        const doc = new jsPDF();
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(22);
        doc.setTextColor('#3B82F6');
        doc.text("OralVis Healthcare Scan Report", 10, 25);
        doc.setDrawColor('#E5E7EB');
        doc.line(10, 30, 200, 30);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(12);
        doc.setTextColor('#1F2937');
        let yPos = 40;
        const addText = (label, value) => {
            doc.text(`${label}:`, 10, yPos);
            doc.setFont('helvetica', 'bold');
            doc.text(value, 45, yPos);
            doc.setFont('helvetica', 'normal');
            yPos += 8;
        };
        addText(`Patient Name`, scan.patientName);
        addText(`Patient ID`, scan.patientId);
        addText(`Scan Type`, scan.scanType);
        addText(`Region`, scan.region);
        addText(`Upload Date`, new Date(scan.uploadDate).toLocaleString());
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = scan.imageUrl;
        img.onload = () => {
            const imgWidth = 180;
            const imgHeight = (img.height * imgWidth) / img.width;
            const imgX = (doc.internal.pageSize.getWidth() - imgWidth) / 2;
            const imgY = yPos + 10;
            if (imgY + imgHeight > doc.internal.pageSize.getHeight() - 10) {
                doc.addPage();
                imgY = 20;
            }
            doc.addImage(img, 'JPEG', imgX, imgY, imgWidth, imgHeight);
            doc.save(`report-${scan.patientId}-${Date.now()}.pdf`);
        };
        img.onerror = () => {
            alert("Could not load image for PDF.");
        };
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const cardVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div className="p-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <h1 className="text-3xl font-bold text-dark mb-2">Patient Scan Viewer</h1>
                <p className="text-gray-500 mb-8">Review all uploaded patient scans.</p>
            </motion.div>

            <AnimatePresence>
                {loading ? (
                    <div className="text-center py-10">Loading...</div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    >
                        {scans.map((scan) => (
                            <motion.div
                                key={scan.id}
                                variants={cardVariants}
                                className="bg-white rounded-xl shadow-soft overflow-hidden border border-gray-200 flex flex-col"
                            >
                                <img src={scan.imageUrl} alt="Scan" className="w-full h-48 object-cover"/>
                                <div className="p-5 flex flex-col flex-grow">
                                    <h3 className="text-lg font-bold text-dark truncate">{scan.patientName}</h3>
                                    <p className="text-sm text-gray-500 mb-4">ID: {scan.patientId}</p>
                                    <div className="space-y-2 text-sm text-gray-700 mb-4 flex-grow">
                                        <div className="flex items-center"><MapPinIcon className="h-4 w-4 mr-2 text-gray-400"/>Region: <span className="font-semibold ml-1">{scan.region}</span></div>
                                        <div className="flex items-center"><CalendarDaysIcon className="h-4 w-4 mr-2 text-gray-400"/>Date: <span className="font-semibold ml-1">{new Date(scan.uploadDate).toLocaleDateString()}</span></div>
                                    </div>
                                    <div className="mt-auto pt-4 border-t border-gray-100 flex space-x-2">
                                        <a href={scan.imageUrl} target="_blank" rel="noopener noreferrer" className="flex-1 text-center py-2 px-3 text-sm font-semibold text-primary bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors">
                                           <EyeIcon className="h-5 w-5 inline mr-1"/> View
                                        </a>
                                        <button onClick={() => handleDownloadPDF(scan)} className="flex-1 py-2 px-3 text-sm font-semibold text-secondary bg-green-100 rounded-lg hover:bg-green-200 transition-colors">
                                            <DocumentArrowDownIcon className="h-5 w-5 inline mr-1"/> Report
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DentistDashboard;