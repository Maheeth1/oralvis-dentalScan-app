import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

import LoginPage from './pages/LoginPage';
import TechnicianDashboard from './pages/TechnicianDashboard';
import DentistDashboard from './pages/DentistDashboard';

const PrivateRoute = ({ children, role }) => {
    const token = localStorage.getItem('token');

    if (!token) {
        return <Navigate to="/login" />;
    }

    try {
        const decoded = jwtDecode(token);
        if (decoded.role !== role) {
            // Optional: Redirect to a 'not authorized' page or back to login
            return <Navigate to="/login" />;
        }
        return children;
    } catch (error) {
        // Invalid token
        localStorage.removeItem('token');
        return <Navigate to="/login" />;
    }
};

function App() {
    return (
        <Router>
            <div className="bg-gray-100 min-h-screen">
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route
                        path="/technician"
                        element={
                            <PrivateRoute role="Technician">
                                <TechnicianDashboard />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/dentist"
                        element={
                            <PrivateRoute role="Dentist">
                                <DentistDashboard />
                            </PrivateRoute>
                        }
                    />
                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;