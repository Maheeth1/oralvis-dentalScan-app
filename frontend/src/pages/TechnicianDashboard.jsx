import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { UserIcon, IdentificationIcon, CubeTransparentIcon, MapPinIcon, PhotoIcon } from '@heroicons/react/24/outline';

const TechnicianDashboard = () => {
    const [patientName, setPatientName] = useState('');
    const [patientId, setPatientId] = useState('');
    const [region, setRegion] = useState('Frontal');
    const [scanImage, setScanImage] = useState(null);
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // ... (handleSubmit function remains the same)
    const handleSubmit = async (e) => {
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
        formData.append('scanType', 'RGB');
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
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <div className="p-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <h1 className="text-3xl font-bold text-dark mb-2">Upload New Scan</h1>
                <p className="text-gray-500 mb-8">Fill in the details below to add a new patient scan.</p>
                
                <div className="bg-white p-8 rounded-xl shadow-soft border border-gray-200">
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Patient Name */}
                        <div className="relative">
                            <UserIcon className="h-5 w-5 text-gray-400 absolute top-3.5 left-4" />
                            <input type="text" value={patientName} onChange={(e) => setPatientName(e.target.value)} required 
                                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                placeholder="Patient Name"
                            />
                        </div>
                        {/* Patient ID */}
                         <div className="relative">
                            <IdentificationIcon className="h-5 w-5 text-gray-400 absolute top-3.5 left-4" />
                            <input type="text" value={patientId} onChange={(e) => setPatientId(e.target.value)} required 
                                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                                placeholder="Patient ID"
                            />
                        </div>
                         {/* Region */}
                         <div className="relative">
                            <MapPinIcon className="h-5 w-5 text-gray-400 absolute top-3.5 left-4" />
                            <select value={region} onChange={(e) => setRegion(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                            >
                                <option>Frontal</option>
                                <option>Upper Arch</option>
                                <option>Lower Arch</option>
                            </select>
                        </div>
                        {/* Scan Type (read-only) */}
                         <div className="relative">
                            <CubeTransparentIcon className="h-5 w-5 text-gray-400 absolute top-3.5 left-4" />
                            <input type="text" value="RGB" readOnly
                                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                            />
                        </div>
                        {/* File Upload */}
                        <div className="md:col-span-2">
                             <label htmlFor="scanImage" className="block text-sm font-medium text-gray-700 mb-2">Scan Image</label>
                             <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                <div className="space-y-1 text-center">
                                    <PhotoIcon className="mx-auto h-12 w-12 text-gray-400"/>
                                    <div className="flex text-sm text-gray-600">
                                        <label htmlFor="scanImage" className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-accent focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary">
                                            <span>Upload a file</span>
                                            <input id="scanImage" name="scanImage" type="file" className="sr-only" onChange={(e) => setScanImage(e.target.files[0])} accept="image/jpeg, image/png" required />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                                    {scanImage && <p className="text-sm font-semibold text-green-600 pt-2">{scanImage.name}</p>}
                                </div>
                             </div>
                        </div>

                        <div className="md:col-span-2">
                            <motion.button type="submit" disabled={isSubmitting}
                                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                className={`w-full py-3 font-semibold rounded-lg shadow-lg transition-all duration-200 
                                ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-primary to-accent text-white'}`}
                            >
                                {isSubmitting ? 'Uploading...' : 'Submit Scan'}
                            </motion.button>
                        </div>
                    </form>
                     {message && (
                        <p className={`mt-6 text-center font-medium ${message.includes('successfully') ? 'text-secondary' : 'text-red-500'}`}>
                            {message}
                        </p>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default TechnicianDashboard;