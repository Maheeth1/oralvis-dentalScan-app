import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../api'; // Use our new api instance

const PrivateRoute = ({ children, role }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [isAuthorized, setIsAuthorized] = useState(null);

    useEffect(() => {
        const verifyUser = async () => {
            try {
                const response = await api.get('/api/verify');
                setIsAuthenticated(true);
                // Check if the user's role matches the required role for the route
                setIsAuthorized(response.data.role === role);
            } catch (error) {
                setIsAuthenticated(false);
                setIsAuthorized(false);
            }
        };

        verifyUser();
    }, [role]);

    if (isAuthenticated === null) {
        return <div>Loading...</div>; // Or a spinner component
    }

    if (!isAuthenticated || !isAuthorized) {
        return <Navigate to="/login" />;
    }

    return children;
};

export default PrivateRoute;