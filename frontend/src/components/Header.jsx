import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = ({ title }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <header className="bg-white shadow-soft py-4 px-6 md:px-8 border-b border-gray-200">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-dark tracking-wide">{title}</h1>
                <button
                    onClick={handleLogout}
                    className="px-5 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors duration-200 shadow-sm"
                >
                    Logout
                </button>
            </div>
        </header>
    );
};

export default Header;