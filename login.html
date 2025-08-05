<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Đăng nhập Firebase</title>
    <!-- Tải Tailwind CSS để tạo kiểu nhanh chóng và đẹp mắt -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Tải phông chữ Inter từ Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <!-- Tải Font Awesome để dùng biểu tượng Google -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <style>
        body {
            font-family: 'Inter', sans-serif;
            background-color: #f3f4f6; /* Màu nền nhẹ nhàng */
        }
    </style>
</head>
<body class="flex items-center justify-center min-h-screen bg-gray-100 p-4">
    <div id="app" class="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-200">
        <h1 class="text-3xl font-bold text-center text-gray-800 mb-6">Chào mừng</h1>

        <!-- Khu vực hiển thị thông báo -->
        <div id="message" class="mb-4 p-3 rounded-lg text-sm text-center hidden"></div>

        <!-- Biểu mẫu đăng nhập/đăng ký -->
        <div id="auth-form-container">
            <h2 class="text-2xl font-semibold text-gray-700 mb-5 text-center">Đăng nhập / Đăng ký</h2>
            <div class="mb-4">
                <label for="email" class="block text-gray-700 text-sm font-medium mb-2">Email:</label>
                <input type="email" id="email" class="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200" placeholder="nhap@email.com">
            </div>
            <div class="mb-6">
                <label for="password" class="block text-gray-700 text-sm font-medium mb-2">Mật khẩu:</label>
                <input type="password" id="password" class="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200" placeholder="Mật khẩu (ít nhất 6 ký tự)">
            </div>
            <div class="flex flex-col space-y-3">
                <button id="registerBtn" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-200 transform hover:scale-105 shadow-md">
                    Đăng ký
                </button>
                <button id="loginBtn" class="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-200 transform hover:scale-105 shadow-md">
                    Đăng nhập
                </button>
                <div class="relative flex py-5 items-center">
                    <div class="flex-grow border-t border-gray-300"></div>
                    <span class="flex-shrink mx-4 text-gray-500">HOẶC</span>
                    <div class="flex-grow border-t border-gray-300"></div>
                </div>
                <button id="googleLoginBtn" class="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-200 transform hover:scale-105 shadow-md flex items-center justify-center">
                    <i class="fab fa-google mr-2"></i> Đăng nhập với Google
                </button>
            </div>
        </div>

        <!-- Khu vực thông tin người dùng (hiển thị sau khi đăng nhập) -->
        <div id="user-info-container" class="hidden text-center">
            <h2 class="text-2xl font-semibold text-gray-700 mb-4">Chào mừng trở lại!</h2>
            <p class="text-gray-600 mb-2">Bạn đã đăng nhập với email:</p>
            <p id="user-email" class="text-lg font-medium text-blue-600 mb-6"></p>
            <button id="logoutBtn" class="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-200 transform hover:scale-105 shadow-md">
                Đăng xuất
            </button>
        </div>
    </div>

    <!-- Tải Firebase SDKs -->
    <script type="module">
        // Import các module cần thiết từ Firebase SDK
        import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
        import {
            getAuth,
            signInAnonymously,
            signInWithCustomToken,
            onAuthStateChanged,
            createUserWithEmailAndPassword,
            signInWithEmailAndPassword,
            signOut,
            GoogleAuthProvider, // Import GoogleAuthProvider
            signInWithPopup // Import signInWithPopup
        } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

        // Lấy cấu hình Firebase và ID ứng dụng từ môi trường Canvas
        // Đây là các biến toàn cục được cung cấp tự động
        const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
       const firebaseConfig = {
  apiKey: "AIzaSyBrRbAJ_4ANCr-hu4foQYXlXyzgdW4Lbpo",
  authDomain: "minigame-5092e.firebaseapp.com",
  projectId: "minigame-5092e",
  storageBucket: "minigame-5092e.firebasestorage.app",
  messagingSenderId: "442342072889",
  appId: "1:442342072889:web:8b643550bc05e6ef08e3e8",
  measurementId: "G-LSH3P18DMM"
};
        const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

        // Khởi tạo ứng dụng Firebase
        let app;
        let auth;

        // Lấy các phần tử DOM
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const registerBtn = document.getElementById('registerBtn');
        const loginBtn = document.getElementById('loginBtn');
        const googleLoginBtn = document.getElementById('googleLoginBtn'); // Lấy nút đăng nhập Google
        const logoutBtn = document.getElementById('logoutBtn');
        const messageDiv = document.getElementById('message');
        const authFormContainer = document.getElementById('auth-form-container');
        const userInfoContainer = document.getElementById('user-info-container');
        const userEmailDisplay = document.getElementById('user-email');

        /**
         * Hàm hiển thị thông báo cho người dùng
         * @param {string} msg - Nội dung thông báo
         * @param {string} type - Loại thông báo ('success', 'error', 'info')
         */
        function showMessage(msg, type) {
            messageDiv.textContent = msg;
            messageDiv.classList.remove('hidden', 'bg-red-100', 'text-red-700', 'bg-green-100', 'text-green-700', 'bg-blue-100', 'text-blue-700');
            if (type === 'error') {
                messageDiv.classList.add('bg-red-100', 'text-red-700');
            } else if (type === 'success') {
                messageDiv.classList.add('bg-green-100', 'text-green-700');
            } else { // info
                messageDiv.classList.add('bg-blue-100', 'text-blue-700');
            }
            messageDiv.classList.remove('hidden');
        }

        /**
         * Hàm ẩn thông báo
         */
        function hideMessage() {
            messageDiv.classList.add('hidden');
        }

        /**
         * Hàm khởi tạo Firebase và xử lý xác thực ban đầu
         */
        async function initializeFirebase() {
            try {
                app = initializeApp(firebaseConfig);
                auth = getAuth(app);

                // Đã loại bỏ việc sử dụng initialAuthToken và signInAnonymously
                // vì bạn đang sử dụng cấu hình Firebase cá nhân.
                // onAuthStateChanged sẽ tự động xử lý trạng thái đăng nhập.

                // Lắng nghe trạng thái xác thực thay đổi
                onAuthStateChanged(auth, (user) => {
                    if (user) {
                        // Người dùng đã đăng nhập
                        authFormContainer.classList.add('hidden');
                        userInfoContainer.classList.remove('hidden');
                        userEmailDisplay.textContent = user.email || 'Người dùng ẩn danh';
                        hideMessage();
                    } else {
                        // Người dùng đã đăng xuất
                        authFormContainer.classList.remove('hidden');
                        userInfoContainer.classList.add('hidden');
                        emailInput.value = '';
                        passwordInput.value = '';
                        hideMessage();
                    }
                });
            } catch (error) {
                console.error("Lỗi khi khởi tạo Firebase hoặc xác thực:", error);
                showMessage(`Lỗi khởi tạo: ${error.message}`, 'error');
            }
        }

        /**
         * Xử lý sự kiện đăng ký người dùng mới
         */
        registerBtn.addEventListener('click', async () => {
            const email = emailInput.value;
            const password = passwordInput.value;

            if (!email || !password) {
                showMessage('Vui lòng nhập email và mật khẩu.', 'error');
                return;
            }
            if (password.length < 6) {
                showMessage('Mật khẩu phải có ít nhất 6 ký tự.', 'error');
                return;
            }

            showMessage('Đang đăng ký...', 'info');
            try {
                await createUserWithEmailAndPassword(auth, email, password);
                showMessage('Đăng ký thành công! Bạn đã được đăng nhập.', 'success');
            } catch (error) {
                console.error("Lỗi đăng ký:", error);
                let errorMessage = 'Đăng ký thất bại. Vui lòng thử lại.';
                if (error.code === 'auth/email-already-in-use') {
                    errorMessage = 'Email này đã được sử dụng. Vui lòng đăng nhập hoặc sử dụng email khác.';
                } else if (error.code === 'auth/invalid-email') {
                    errorMessage = 'Email không hợp lệ.';
                } else if (error.code === 'auth/weak-password') {
                    errorMessage = 'Mật khẩu quá yếu. Vui lòng chọn mật khẩu mạnh hơn.';
                }
                showMessage(errorMessage, 'error');
            }
        });

        /**
         * Xử lý sự kiện đăng nhập người dùng
         */
        loginBtn.addEventListener('click', async () => {
            const email = emailInput.value;
            const password = passwordInput.value;

            if (!email || !password) {
                showMessage('Vui lòng nhập email và mật khẩu.', 'error');
                return;
            }

            showMessage('Đang đăng nhập...', 'info');
            try {
                await signInWithEmailAndPassword(auth, email, password);
                showMessage('Đăng nhập thành công!', 'success');
            } catch (error) {
                console.error("Lỗi đăng nhập:", error);
                let errorMessage = 'Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu.';
                if (error.code === 'auth/invalid-email') {
                    errorMessage = 'Email không hợp lệ.';
                } else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                    errorMessage = 'Email hoặc mật khẩu không đúng.';
                }
                showMessage(errorMessage, 'error');
            }
        });

        /**
         * Xử lý sự kiện đăng nhập bằng Google
         */
        googleLoginBtn.addEventListener('click', async () => {
            showMessage('Đang đăng nhập với Google...', 'info');
            try {
                const provider = new GoogleAuthProvider();
                await signInWithPopup(auth, provider);
                showMessage('Đăng nhập với Google thành công!', 'success');
            } catch (error) {
                console.error("Lỗi đăng nhập Google:", error);
                let errorMessage = 'Đăng nhập với Google thất bại. Vui lòng thử lại.';
                if (error.code === 'auth/popup-closed-by-user') {
                    errorMessage = 'Cửa sổ bật lên đã bị đóng bởi người dùng.';
                } else if (error.code === 'auth/cancelled-popup-request') {
                    errorMessage = 'Yêu cầu đăng nhập đã bị hủy.';
                } else if (error.code === 'auth/account-exists-with-different-credential') {
                    errorMessage = 'Tài khoản đã tồn tại với thông tin đăng nhập khác. Vui lòng đăng nhập bằng phương thức ban đầu.';
                }
                showMessage(errorMessage, 'error');
            }
        });

        /**
         * Xử lý sự kiện đăng xuất
         */
        logoutBtn.addEventListener('click', async () => {
            showMessage('Đang đăng xuất...', 'info');
            try {
                await signOut(auth);
                showMessage('Bạn đã đăng xuất.', 'success');
            } catch (error) {
                console.error("Lỗi đăng xuất:", error);
                showMessage(`Đăng xuất thất bại: ${error.message}`, 'error');
            }
        });

        // Khởi tạo Firebase khi trang được tải hoàn toàn
        window.onload = initializeFirebase;
    </script>
</body>
</html>
