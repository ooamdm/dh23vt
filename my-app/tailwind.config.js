import React from 'react'; // Đã bỏ useRef, useEffect, useState vì không còn dùng cho Three.js

function LoginPage({ onSignIn }) {
    // Giả sử onSignIn là một hàm được truyền xuống từ component cha
    const handleSignIn = () => {
        console.log("Đang xử lý đăng nhập...");
        if (onSignIn) {
            onSignIn();
        }
    };

    return (
        <div id="login-page" className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            {/* Phần khung Login được căn giữa lại */}
            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-2 animate-fade-in">Dashboard Sinh Viên</h1>
                
                <p className="text-gray-600 mb-6 animate-fade-in-delay-1">Vui lòng đăng nhập để tiếp tục</p>
                
                <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-6 rounded-md shadow-inner animate-slide-up-fade-in">
                    <p className="font-semibold">Hey Gen Z ✌️</p>
                    <p className="text-sm">Nếu bạn được chuyển từ Softr sang đây để xem điểm thì chúc mừng bạn, bạn đã đến đúng nơi!! 🔥</p>
                    <p className="text-sm mt-2">Hãy login bằng tài khoản Google sinh viên của bạn để bắt đầu nhé!</p>
                </div>
                
                <button
                    id="login-btn"
                    className="w-full btn btn-lg btn-custom btn-google flex items-center justify-center"
                    onClick={handleSignIn}
                >
                    <i className="fab fa-google me-3"></i>
                    Đăng nhập với Google
                </button>
                
                {/* Phần chữ ký */}
                <div className="text-right mt-8">
                    <p className="text-lg font-signature">Hồ Quốc Thắng</p>
                    <p className="text-sm text-gray-500">Người quản trị</p>
                </div>
            </div>
            {/* Phần bên phải với hiệu ứng 3D đã được loại bỏ hoàn toàn */}
        </div>
    );
}

export default LoginPage;
// Không cần import ReactDOM vì không sử dụng Three.js nữa
// Không cần sử dụng useRef, useEffect, useState vì không có hiệu ứng
// Không cần sử dụng Three.js nữa, chỉ cần tập trung vào giao diện đăng nhập đơn giản và hiệu ứng CSS