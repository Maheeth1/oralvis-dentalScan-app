// frontend/src/components/PrivateRoute.jsx

import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../api';

const PrivateRoute = ({ children, role }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null); // Use null for loading state
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const verifyUser = async () => {
            try {
                // This API call checks the cookie on the backend
                const response = await api.get('/api/verify');
                if (response.data.loggedIn) {
                    setIsAuthenticated(true);
                    // Check if the user's role matches the required role for the route
                    if (response.data.role === role) {
                        setIsAuthorized(true);
                    }
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
                // If the cookie is invalid or expired, the API will return an error
                setIsAuthenticated(false);
            }
        };

        verifyUser();
    }, [role]);

    // Show a loading indicator while we verify the user
    if (isAuthenticated === null) {
        return <div className="flex justify-center items-center h-screen"><div>Loading...</div></div>;
    }

    // If not authenticated or not authorized, redirect to login
    if (!isAuthenticated || !isAuthorized) {
        return <Navigate to="/login" />;
    }

    // If authenticated and authorized, show the page
    return children;
};

export default PrivateRoute;