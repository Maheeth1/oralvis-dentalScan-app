// frontend/src/pages/LoginPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';
import api from '../api';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await api.post('/api/login', { email, password });

            // --- ADD THIS LINE TO DEBUG ---
            console.log('Login successful, response data:', response.data); 

            if (response.data.role === 'Technician') {
                // --- ADD THIS LINE TO DEBUG ---
                console.log('Navigating to /technician');
                navigate('/technician');
            } else if (response.data.role === 'Dentist') {
                console.log('Navigating to /dentist');
                navigate('/dentist');
            }
        } catch (err) {
            setError('Invalid credentials. Please try again.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-indigo-200 to-purple-200">
            <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md p-8 space-y-6 bg-white/50 rounded-2xl shadow-2xl backdrop-blur-lg border border-white/30"
            >
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-dark tracking-tight">OralVis Portal</h1>
                    <p className="mt-2 text-gray-600">Secure access for healthcare professionals.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="relative">
                        <EnvelopeIcon className="h-5 w-5 text-gray-400 absolute top-3.5 left-4" />
                        <input
                            type="email"
                            value={email}
                            // THIS IS THE FIX: Changed e.e.target.value to e.target.value
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-dark"
                            required
                            placeholder="Email Address"
                        />
                    </div>
                    {/* ... the rest of the component is the same ... */}
                    <div className="relative">
                        <LockClosedIcon className="h-5 w-5 text-gray-400 absolute top-3.5 left-4" />
                        <input
                            type={showPassword ? 'text' : 'password'} 
                            value={password} onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-dark"
                            required placeholder="Password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-500 hover:text-primary"
                        >
                            {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                        </button>
                    </div>

                    {error && <p className="text-sm text-red-600 text-center font-medium">{error}</p>}
                    
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="w-full py-3 font-semibold text-white bg-gradient-to-r from-primary to-accent rounded-lg hover:opacity-90 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 shadow-lg"
                    >
                        Sign In
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
};

export default LoginPage;