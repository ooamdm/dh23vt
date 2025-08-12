// src/components/Dashboard/DashboardHeader.tsx
import React from 'react';
import Image from 'next/image'; // Import Next.js Image component

// Định nghĩa interface cho đối tượng người dùng (User)
interface User {
  displayName?: string | null;
  email?: string | null;
  photoURL?: string | null;
}

// Định nghĩa interface cho các props của component DashboardHeader
interface DashboardHeaderProps {
  user: User | null; // user có thể là đối tượng User hoặc null
  onSignOut: () => void; // onSignOut là một hàm không nhận tham số và không trả về giá trị
}

function DashboardHeader({ user, onSignOut }: DashboardHeaderProps) {
  return (
    <header className="bg-white shadow-md sticky top-0 z-10">
      <div className="container-fluid px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 py-3">
          <div className="flex items-center">
            {/* Sử dụng Font Awesome icon. Đảm bảo Font Awesome đã được import vào dự án */}
            <i className="fas fa-chart-line text-2xl text-blue-600 me-3"></i>
            <h1 className="text-xl font-bold text-gray-900 mb-0">Dashboard</h1>
          </div>
          <div className="flex items-center">
            <div id="user-info" className="text-right me-3 hidden sm:block">
              {/* Hiển thị tên người dùng, nếu có */}
              <p id="user-name" className="font-semibold text-gray-800 mb-0">
                {user?.displayName || ''}
              </p>
              {/* Hiển thị email người dùng, nếu có */}
              <p id="user-email" className="text-sm text-gray-500 mb-0">
                {user?.email || ''}
              </p>
            </div>
            {/* SỬA LỖI: Sử dụng Next.js Image component để tối ưu hóa */}
            <Image
              id="user-photo"
              className="h-10 w-10 rounded-full me-3"
              src={user?.photoURL || "https://placehold.co/40x40/aabbcc/ffffff?text=User"}
              alt="User photo"
              width={40} // Chiều rộng bắt buộc
              height={40} // Chiều cao bắt buộc
              priority // Tải sớm ảnh này để cải thiện LCP
            />
            <button
              id="logout-btn"
              className="btn btn-danger btn-sm"
              onClick={onSignOut} // Gọi hàm onSignOut khi click
            >
              {/* Sử dụng Font Awesome icon. Đảm bảo Font Awesome đã được import vào dự án */}
              <i className="fas fa-sign-out-alt me-2"></i>Đăng xuất
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default DashboardHeader;
