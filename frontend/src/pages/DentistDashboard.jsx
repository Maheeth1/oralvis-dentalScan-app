import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    DocumentArrowDownIcon, 
    EyeIcon, 
    CalendarDaysIcon, 
    MapPinIcon, 
    TrashIcon 
} from '@heroicons/react/24/outline';
import api from '../api'; 
import LoadingScreen from '../components/LoadingScreen';

const DentistDashboard = () => {
    const [scans, setScans] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchScans = async () => {
            try {
                const response = await api.get('/api/scans');
                setScans(response.data.scans);
            } catch (error) {
                console.error("Failed to fetch scans", error);
                // Optionally, set an error state to show a message to the user
            } finally {
                setLoading(false);
            }
        };
        fetchScans();
    }, []);

    const handleDownloadPDF = (scan) => {
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
            let imgY = yPos + 10;

            if (imgY + imgHeight > doc.internal.pageSize.getHeight() - 10) {
                doc.addPage();
                imgY = 20; // Start image lower on new page
            }
            doc.addImage(img, 'JPEG', imgX, imgY, imgWidth, imgHeight);
            doc.save(`report-${scan.patientId}-${Date.now()}.pdf`);
        };
        img.onerror = () => {
            alert("Could not load image for PDF. Please ensure the image URL is accessible.");
        };
    };

    const handleDelete = async (scanId) => {
        if (window.confirm('Are you sure you want to permanently delete this scan? This action cannot be undone.')) {
            try {
                await api.delete(`/api/scans/${scanId}`);
                setScans(currentScans => currentScans.filter(scan => scan.id !== scanId));
            } catch (error) {
                console.error("Failed to delete scan:", error);
                alert("Could not delete the scan. Please try again.");
            }
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const cardVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div className="p-8">
            <AnimatePresence>
                {loading ? (
                    <LoadingScreen />
                ) : scans.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-10 text-gray-600 text-lg"
                    >
                        No scans available.
                    </motion.div>
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
                                layout
                                exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.3 } }}
                                whileHover={{ scale: 1.03, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }} // Lift and shadow on hover
                                whileTap={{ scale: 0.98 }} // Slight press down on click
                                transition={{ type: "spring", stiffness: 300, damping: 20 }} // Smooth spring animation
                                className="bg-white rounded-xl shadow-soft overflow-hidden border border-gray-200 flex flex-col cursor-pointer" // Add cursor-pointer
                            >
                                <img src={scan.imageUrl} alt={`Scan for ${scan.patientName}`} className="w-full h-48 object-cover"/>
                                <div className="p-5 flex flex-col flex-grow">
                                    <h3 className="text-lg font-bold text-dark truncate">{scan.patientName}</h3>
                                    <p className="text-sm text-gray-500 mb-4">ID: {scan.patientId}</p>
                                    
                                    <div className="space-y-2 text-sm text-gray-700 mb-4 flex-grow">
                                        <div className="flex items-center"><MapPinIcon className="h-4 w-4 mr-2 text-gray-400"/>Region: <span className="font-semibold ml-1">{scan.region}</span></div>
                                        <div className="flex items-center">
                                            <CalendarDaysIcon className="h-4 w-4 mr-2 text-gray-400" />
                                            Date:{" "}
                                            <span className="font-semibold ml-1">
                                                {(() => {
                                                const date = new Date(scan.uploadDate);
                                                return `${String(date.getDate()).padStart(2, "0")}/${String(
                                                    date.getMonth() + 1
                                                ).padStart(2, "0")}/${date.getFullYear()}`;
                                                })()}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-auto pt-4 border-t border-gray-100 grid grid-cols-3 gap-2">
                                        <a 
                                            href={scan.imageUrl} target="_blank" rel="noopener noreferrer" 
                                            title="View Full Image" 
                                            className="flex items-center justify-center py-2 px-2 text-sm font-semibold text-primary bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors duration-200 ease-in-out"
                                        >
                                           <EyeIcon className="h-5 w-5"/>
                                        </a>
                                        <button 
                                            onClick={() => handleDownloadPDF(scan)} 
                                            title="Download Report" 
                                            className="flex items-center justify-center py-2 px-2 text-sm font-semibold text-secondary bg-green-100 rounded-lg hover:bg-green-200 transition-colors duration-200 ease-in-out"
                                        >
                                            <DocumentArrowDownIcon className="h-5 w-5"/>
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(scan.id)} 
                                            title="Delete Scan" 
                                            className="flex items-center justify-center py-2 px-2 text-sm font-semibold text-red-600 bg-red-100 rounded-lg hover:bg-red-200 transition-colors duration-200 ease-in-out"
                                        >
                                            <TrashIcon className="h-5 w-5"/>
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