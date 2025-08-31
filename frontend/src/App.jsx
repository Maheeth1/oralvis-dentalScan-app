import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Your page components
import LoginPage from './pages/LoginPage';
import TechnicianDashboard from './pages/TechnicianDashboard';
import DentistDashboard from './pages/DentistDashboard';

// Layout and Route components
import DashboardLayout from './components/DashboardLayout';
import PrivateRoute from './components/PrivateRoute'; 

function App() {
    return (
        <Router>
            <div className="font-sans antialiased text-dark">
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route
                        path="/technician"
                        element={
                            <PrivateRoute role="Technician">
                                <DashboardLayout>
                                    <TechnicianDashboard />
                                </DashboardLayout>
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/dentist"
                        element={
                            <PrivateRoute role="Dentist">
                                <DashboardLayout>
                                    <DentistDashboard />
                                </DashboardLayout>
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