// frontend/src/components/DashboardLayout.jsx

import React from 'react';
import Sidebar from './Sidebar';

const DashboardLayout = ({ children, title }) => {
    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white shadow-sm border-b border-gray-200">
    {/* This container now uses Flexbox for alignment */}
    <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex items-center">
        
        {/* 1. Add the sidebar toggle button here */}
        <button
            // Make sure this onClick is connected to your toggleSidebar function
            onClick={() => { /* Your toggle function */ }}
            className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 md:hidden"
            aria-label="Toggle menu"
        >
            {/* You'll need to import the Bars3Icon from heroicons */}
            {/* <Bars3Icon className="h-6 w-6" /> */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
        </button>

        {/* 2. Your title, with spacing and responsive text size */}
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 ml-4">
            {title}
        </h1>

    </div>
</header>
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;