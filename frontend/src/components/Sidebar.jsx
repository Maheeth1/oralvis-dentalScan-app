// frontend/src/components/Sidebar.jsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { CloudArrowUpIcon, Squares2X2Icon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';
import api from '../api';

const Sidebar = () => {
    const navigate = useNavigate();
    const userRole = localStorage.getItem('userRole'); // Get role from localStorage

    const handleLogout = async () => {
        try {
            await api.post('/api/logout');
            localStorage.removeItem('userRole'); // Clear the role on logout
            navigate('/login');
        } catch (error) {
            console.error("Logout failed", error);
            // Even if API fails, log them out on the frontend
            localStorage.removeItem('userRole');
            navigate('/login');
        }
    };

    // Define all possible links
    const allLinks = [
        { name: 'Upload Scan', to: '/technician', icon: CloudArrowUpIcon, role: 'Technician' },
        { name: 'Scan Viewer', to: '/dentist', icon: Squares2X2Icon, role: 'Dentist' },
    ];
    
    // Filter links based on the user's role
    const navLinks = allLinks.filter(link => link.role === userRole);

    return (
        <aside className="w-64 flex-shrink-0 bg-dark p-6 flex flex-col justify-between">
            <div>
                <div className="flex items-center space-x-3 text-white mb-12">
                     <svg className="h-8 w-8 text-primary" viewBox="0 0 24 24"> 
                        <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                    </svg>
                    <span className="text-xl font-bold tracking-wider">OralVis</span>
                </div>
                <nav className="space-y-3">
                    {navLinks.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.to}
                            className={({ isActive }) =>
                                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                                isActive
                                    ? 'bg-primary text-white shadow-lg'
                                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                }`
                            }
                        >
                            <item.icon className="h-6 w-6" />
                            <span className="font-medium">{item.name}</span>
                        </NavLink>
                    ))}
                </nav>
            </div>
            <button
                onClick={handleLogout}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-red-500 hover:text-white transition-colors duration-200"
            >
                <ArrowLeftOnRectangleIcon className="h-6 w-6" />
                <span className="font-medium">Logout</span>
            </button>
        </aside>
    );
};

export default Sidebar;