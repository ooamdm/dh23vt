// my-app/app/login/page.jsx
// Đây là trang đăng nhập của ứng dụng, sử dụng React và Tailwind CSS để tạo
// giao diện người dùng đẹp mắt và thân thiện. Trang này bao gồm một nút đăng   
// import * as THREE from 'three'; // Không cần Three.js nữa
// Các import khác của bạn
// import { escapeHtml } from '@/utils/helpers';
// import { onSignIn } from '../path/to/your/auth/logic';

// ThreeDTextAnimation component đã bị loại bỏ

function LoginPage({ onSignIn }) {
    // Giả sử onSignIn là một hàm được truyền xuống từ component cha

    return (
        <div id="login-page" className="min-h-screen flex items-center justify-center bg-gray-50">

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

            onClick={onSignIn}

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

</div>

            
    
    );
}

export default LoginPage;
// Lưu ý: Bạn cần đảm bảo rằng các class CSS như animate-fade-in, animate-fade-in-delay-1, animate-slide-up-fade-in, btn-custom, btn-google, text-shadow-3d, và animate-text-gradient đã được định nghĩa trong file CSS của bạn.
// Nếu bạn sử dụng Tailwind CSS, hãy đảm bảo rằng các tiện ích này đã được cấu hình đúng trong tệp cấu hình Tailwind của bạn.
// Bạn có thể thêm các hiệu ứng CSS tùy chỉnh trong tệp CSS của bạn để tạo ra các hiệu ứng hoạt hình mong muốn
// như fade-in, slide-up, và text gradient. 