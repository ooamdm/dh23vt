// src/components/DashboardHeader.jsx
import React from 'react';

function DashboardHeader({ user, onSignOut }) {
    return (
        <header className="bg-white shadow-md sticky top-0 z-10">
            <div className="container-fluid px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 py-3">
                    <div className="flex items-center">
                        <i className="fas fa-chart-line text-2xl text-blue-600 me-3"></i>
                        <h1 className="text-xl font-bold text-gray-900 mb-0">Dashboard</h1>
                    </div>
                    <div className="flex items-center">
                        <div id="user-info" className="text-right me-3 hidden sm:block">
                            <p id="user-name" className="font-semibold text-gray-800 mb-0">{user?.displayName || ''}</p>
                            <p id="user-email" className="text-sm text-gray-500 mb-0">{user?.email || ''}</p>
                        </div>
                        <img
                            id="user-photo"
                            className="h-10 w-10 rounded-full me-3"
                            src={user?.photoURL || "https://placehold.co/40x40/aabbcc/ffffff?text=User"}
                            alt="User photo"
                        />
                        <button
                            id="logout-btn"
                            className="btn btn-danger btn-sm"
                            onClick={onSignOut}
                        >
                            <i className="fas fa-sign-out-alt me-2"></i>Đăng xuất
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default DashboardHeader;
