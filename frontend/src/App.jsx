// frontend/src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import TechnicianDashboard from './pages/TechnicianDashboard';
import DentistDashboard from './pages/DentistDashboard';
import PrivateRoute from './components/PrivateRoute'; 
import LoadingScreen from './components/LoadingScreen';

function App() {
    return (
        <Router>
            <div className="bg-gray-lighter min-h-screen font-sans antialiased text-dark">
                <LoadingScreen />
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    
                    {/* Protected Technician Route */}
                    <Route
                        path="/technician"
                        element={
                            <PrivateRoute role="Technician">
                                <TechnicianDashboard />
                            </PrivateRoute>
                        }
                    />

                    {/* Protected Dentist Route */}
                    <Route
                        path="/dentist"
                        element={
                            <PrivateRoute role="Dentist">
                                <DentistDashboard />
                            </PrivateRoute>
                        }
                    />

                    {/* Redirect any other path to the login page */}
                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;