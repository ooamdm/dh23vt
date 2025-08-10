// src/components/LoginScreen.jsx
import React from 'react';

function LoginScreen({ onSignIn }) {
    return (
        <div id="login-screen" className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Sinh Viên</h1>
                <p className="text-gray-600 mb-6">Vui lòng đăng nhập để tiếp tục</p>
                <button
                    id="login-btn"
                    className="w-full btn btn-lg btn-custom btn-google flex items-center justify-center"
                    onClick={onSignIn}
                >
                    <i className="fab fa-google me-3"></i>
                    Đăng nhập với Google
                </button>
            </div>
        </div>
    );
}

export default LoginScreen;
