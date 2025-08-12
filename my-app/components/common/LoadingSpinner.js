// src/components/common/LoadingSpinner.jsx
import React from 'react';

function LoadingSpinner() {
    return (
        <div id="loading-spinner" className="text-center py-5">
            <i className="fas fa-spinner fa-spin text-4xl text-blue-500"></i>
            <p className="mt-2 text-gray-600">Đang tải dữ liệu...</p>
        </div>
    );
}

export default LoadingSpinner;
