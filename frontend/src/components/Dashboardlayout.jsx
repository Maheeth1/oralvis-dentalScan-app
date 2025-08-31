import React from 'react';
import { jwtDecode } from 'jwt-decode';
import Sidebar from './Sidebar';

const DashboardLayout = ({ children }) => {
    const token = localStorage.getItem('token');
    
    let userRole = null;
    if (document.cookie.includes('token=')) { 
         const getDecodedToken = () => {
             const tokenCookie = document.cookie.split('; ').find(row => row.startsWith('token='));
             if (!tokenCookie) return null;
         }
    }

    return (
        <div className="flex h-screen bg-light">
            <Sidebar />
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    );
};

export default DashboardLayout;