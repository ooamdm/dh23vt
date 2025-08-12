// app/login/page.tsx
"use client"; // This component needs to be a Client Component to use hooks and interact with the browser.

import React, { useState, useEffect } from 'react';
// SỬA LỖI: Import FirebaseError từ '@firebase/util'
import { getAuth, signInWithCustomToken, signInAnonymously, Auth } from 'firebase/auth';
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { FirebaseError } from '@firebase/util'; // SỬA LỖI: Import FirebaseError từ @firebase/util
import { firebaseConfigA, firebaseConfigB } from '../../services/firebase-configs'; // Adjust path as needed
import { signInForProject } from '../../apis/auth'; // Adjust path as needed
import { useRouter } from 'next/navigation'; // Import useRouter from next/navigation


export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter(); // Initialize router

    useEffect(() => {
        const initAndSignIn = async () => {
            // SỬA LỖI: Truy cập __firebase_config và __initial_auth_token trực tiếp từ window
            const firebaseConfig = typeof window !== 'undefined' && typeof window.__firebase_config !== 'undefined' ? JSON.parse(window.__firebase_config) : null;
            const initialAuthToken = typeof window !== 'undefined' && typeof window.__initial_auth_token !== 'undefined' ? window.__initial_auth_token : null;

            if (!firebaseConfig) {
                setError("Firebase configuration is missing.");
                return;
            }

            let appA: FirebaseApp | undefined = getApps().find(app => app.name === 'projectA');
            
            if (!appA) {
                appA = initializeApp(firebaseConfigA, 'projectA');
            }
            const authA: Auth = getAuth(appA);

            try {
                setIsLoading(true);
                // Attempt to sign in with custom token or anonymously for Project A
                if (initialAuthToken) {
                    await signInWithCustomToken(authA, initialAuthToken);
                    console.log("Đã đăng nhập bằng custom token cho Project A từ LoginPage.");
                } else {
                    await signInAnonymously(authA);
                    console.log("Đã đăng nhập ẩn danh cho Project A từ LoginPage.");
                }
                // If sign-in is successful, navigate to the dashboard
                router.push('/'); // Navigate to the root/dashboard page
            } catch (err: unknown) {
                console.error("Xác thực thất bại từ LoginPage:", err);
                if (err instanceof FirebaseError) {
                    setError(`Xác thực thất bại: ${err.code} - ${err.message}`);
                } else if (err instanceof Error) {
                    setError(`Xác thực thất bại: ${err.message}`);
                } else {
                    setError("Xác thực thất bại: Lỗi không xác định.");
                }
            } finally {
                setIsLoading(false);
            }
        };

        initAndSignIn();
    }, [router]); // SỬA LỖI: Loại bỏ __firebase_config và __initial_auth_token khỏi dependencies vì chúng là biến toàn cục tĩnh.


    const handleSignInClick = async (projectKey: 'projectA' | 'projectB') => {
        setIsLoading(true);
        setError(null);

        let config;
        let appName;
        if (projectKey === 'projectA') {
            config = firebaseConfigA;
            appName = 'projectA';
        } else {
            config = firebaseConfigB;
            appName = 'projectB';
        }

        let app: FirebaseApp | undefined = getApps().find(a => a.name === appName);
        if (!app) {
            app = initializeApp(config, appName);
        }
        const auth = getAuth(app);

        try {
            const success = await signInForProject(auth, projectKey);
            if (success) {
                console.log(`Đăng nhập thành công vào ${projectKey}.`);
                router.push('/'); // Navigate to the root/dashboard page on successful sign-in
            } else {
                setError(`Đăng nhập vào ${projectKey} thất bại.`);
            }
        } catch (err: unknown) {
            console.error(`Lỗi khi đăng nhập vào ${projectKey}:`, err);
            if (err instanceof FirebaseError) {
                setError(`Lỗi đăng nhập: ${err.code} - ${err.message}`);
            } else if (err instanceof Error) {
                setError(`Lỗi đăng nhập: ${err.message}`);
            } else {
                setError("Lỗi đăng nhập: Lỗi không xác định.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full text-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Đăng nhập</h2>
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}
                {isLoading ? (
                    <div className="text-center py-5">
                        <i className="fas fa-spinner fa-spin text-4xl text-blue-500"></i>
                        <p className="mt-2 text-gray-600">Đang đăng nhập...</p>
                    </div>
                ) : (
                    <>
                        <p className="text-gray-600 mb-6">Chọn tài khoản để tiếp tục:</p>
                        <button
                            className="btn-google w-full flex items-center justify-center py-3 px-4 rounded-lg text-white font-semibold shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 mb-4"
                            onClick={() => handleSignInClick('projectA')}
                        >
                            <i className="fab fa-google mr-3"></i> Đăng nhập với Project A
                        </button>
                        <button
                            className="btn-google w-full flex items-center justify-center py-3 px-4 rounded-lg text-white font-semibold shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1"
                            onClick={() => handleSignInClick('projectB')}
                        >
                            <i className="fab fa-google mr-3"></i> Đăng nhập với Project B
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
