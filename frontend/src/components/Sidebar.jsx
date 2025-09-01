// frontend/src/components/Sidebar.jsx

import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { CloudArrowUpIcon, Squares2X2Icon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';
import api from '../api';

const Sidebar = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await api.post('/api/logout');
            navigate('/login');
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    const navLinks = [
        { name: 'Upload Scan', to: '/technician', icon: CloudArrowUpIcon },
        { name: 'Scan Viewer', to: '/dentist', icon: Squares2X2Icon },
    ];

    return (
        <aside className="w-64 flex-shrink-0 bg-gray-800 p-5 flex flex-col justify-between">
            <div>
                <div className="flex items-center space-x-3 text-white mb-10">
                    {/* A placeholder for your logo */}
                    <svg className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v11.494m-5.247-8.247l10.494 4.998-10.494 4.998-10.494-4.998 10.494-4.998z" />
                    </svg>
                    <span className="text-xl font-bold tracking-wider">OralVis</span>
                </div>

                <nav className="space-y-2">
                    {navLinks.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.to}
                            className={({ isActive }) =>
                                `flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors duration-200 text-sm font-medium ${
                                isActive
                                    ? 'bg-blue-500 text-white shadow-md'
                                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                }`
                            }
                        >
                            <item.icon className="h-6 w-6" />
                            <span>{item.name}</span>
                        </NavLink>
                    ))}
                </nav>
            </div>
            
            <button
                onClick={handleLogout}
                className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-red-600 hover:text-white transition-colors duration-200 text-sm font-medium"
            >
                <ArrowLeftOnRectangleIcon className="h-6 w-6" />
                <span>Logout</span>
            </button>
        </aside>
    );
};

export default Sidebar;