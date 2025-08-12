// app/layout.tsx
"use client"; // Đặt nếu cần các tính năng tương tác client-side

import React, { useState, useEffect, useCallback, useMemo } from 'react';

// Import các file CSS toàn cục của bạn
import './globals.css';

// Import các hàm xác thực và cơ sở dữ liệu từ các file của bạn
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInWithCustomToken, signInAnonymously, Auth, User as FirebaseAuthUser } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// Thay đổi import từ '@/...' sang đường dẫn tương đối hoặc đảm bảo alias đúng
import { firebaseConfigA, firebaseConfigB } from '../services/firebase-configs';
import { signInForProject, signOutAll } from '../apis/auth';
import { fetchDashboardData } from '../services/firestore';

// Import các components
import DashboardHeader from '../components/Dashboard/DashboardHeader'; // Đảm bảo đã đổi sang .tsx hoặc .js
import LoginPage from './login/page'; // Giả định LoginPage là một Client Component

// Định nghĩa kiểu cho các biến toàn cục từ Canvas Environment
declare global {
    interface Window {
        __app_id?: string;
        __firebase_config?: string;
        __initial_auth_token?: string;
    }
}

// Global variables provided by the Canvas environment (sử dụng với window)
const __app_id = typeof window !== 'undefined' && typeof window.__app_id !== 'undefined' ? window.__app_id : 'default-app-id'; // eslint-disable-line @typescript-eslint/no-unused-vars
const __firebase_config = typeof window !== 'undefined' && typeof window.__firebase_config !== 'undefined' ? JSON.parse(window.__firebase_config) : null; // eslint-disable-line @typescript-eslint/no-unused-vars
const __initial_auth_token = typeof window !== 'undefined' && typeof window.__initial_auth_token !== 'undefined' ? window.__initial_auth_token : null;

// Định nghĩa kiểu cho props của RootLayout
interface RootLayoutProps {
    children: React.ReactNode;
}

// Định nghĩa kiểu cho các hoạt động
interface Activity {
    id: string;
    'Tên hoạt động': string;
    'File upload': string;
    'Điểm cộng': number | string;
    Status: string;
    [key: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

// Định nghĩa kiểu cho đối tượng User (tương tự trong DashboardHeader)
interface User {
    displayName?: string | null;
    email?: string | null;
    photoURL?: string | null;
    uid: string; // Firebase user always has a uid
}

// Định nghĩa kiểu cho stats
interface Stats {
    totalActivities: number;
    sentCount: number;
    processingCount: number;
    cancelledCount: number;
    totalPoints: string;
    totalApprovedPoints: string;
    classificationGroup: string;
}

export default function RootLayout({ children }: RootLayoutProps) {
    // --- STATE MANAGEMENT ---
    const [firebaseApps, setFirebaseApps] = useState<Record<string, FirebaseApp>>({}); // eslint-disable-line @typescript-eslint/no-unused-vars
    const [authInstances, setAuthInstances] = useState<Record<string, Auth>>({});
    const [firestoreDbs, setFirestoreDbs] = useState<Record<string, Firestore>>({});
    const [currentProjectKey, setCurrentProjectKey] = useState<'projectA' | 'projectB'>('projectA');
    const [currentDb, setCurrentDb] = useState<Firestore | null>(null);
    const [signedInUsers, setSignedInUsers] = useState<Record<string, FirebaseAuthUser | null>>({ projectA: null, projectB: null });
    const [cachedData, setCachedData] = useState<Activity[]>([]);
    const [currentSort, setCurrentSort] = useState<{ key: string; order: 'asc' | 'desc' }>({ key: 'Tên hoạt động', order: 'asc' }); // eslint-disable-line @typescript-eslint/no-unused-vars
    const [filterText, setFilterText] = useState<string>(''); // eslint-disable-line @typescript-eslint/no-unused-vars
    const [isLoading, setIsLoading] = useState<boolean>(false); // eslint-disable-line @typescript-eslint/no-unused-vars
    const [isAuthReady, setIsAuthReady] = useState<boolean>(false);
    const [showLoginPage, setShowLoginPage] = useState<boolean>(true);

    // --- AUTHENTICATION HELPERS ---
    // getActiveUserEmail phải được khai báo trước loadAndRenderData và handlePostAuthState
    const getActiveUserEmail = useCallback((): string | null => {
        const user = signedInUsers[currentProjectKey];
        return user ? user.email : null;
    }, [currentProjectKey, signedInUsers]);

    // refreshData phải được khai báo trước loadAndRenderData
    // Đã thêm kiểu trả về Promise<(() => void) | undefined> để rõ ràng hơn
    const refreshData = useCallback(async (email: string | null): Promise<(() => void) | undefined> => {
        if (!email || !currentDb) {
            console.error("Lỗi: Không có email hoặc cơ sở dữ liệu để tải dữ liệu.");
            setIsLoading(false);
            return undefined; // Trả về undefined rõ ràng
        }

        console.log(`Đang lấy dữ liệu mới từ Firestore Project: ${currentProjectKey}...`);
        setIsLoading(true);

        const auth = authInstances[currentProjectKey];
        if (!auth || !auth.currentUser) { // Thêm kiểm tra auth
            console.warn(`Người dùng chưa đăng nhập vào Project ${currentProjectKey}. Đang cố gắng đăng nhập.`);
            const signedIn = await signInForProject(authInstances[currentProjectKey], currentProjectKey);
            if (!signedIn) {
                console.error(`Không thể lấy dữ liệu vì đăng nhập vào Project ${currentProjectKey} thất bại.`);
                setIsLoading(false);
                return undefined; // Trả về undefined rõ ràng
            }
        }

        // SỬA LỖI: Thêm type assertion cho `unsubscribe` để TypeScript hiểu đúng kiểu.
        // Giả định `fetchDashboardData` trả về một hàm hủy đăng ký Firestore (`() => void`).
        const unsubscribe = fetchDashboardData(currentDb, email, currentProjectKey, (activities: Activity[]) => {
            setCachedData(activities);
            sessionStorage.setItem('studentActivities', JSON.stringify(activities));
            sessionStorage.setItem('cachedProject', currentProjectKey);
            console.log("Dữ liệu đã được làm mới và lưu vào cache.");
            setIsLoading(false);
        }, (error: unknown) => {
            console.error("Lỗi khi lắng nghe dữ liệu từ Firestore: ", error);
            setIsLoading(false);
        }) as () => void; // Type assertion

        // fetchDashboardData trả về một hàm unsubscribe, đảm bảo luôn trả về nó.
        return unsubscribe; 
    }, [currentProjectKey, currentDb]); // SỬA LỖI: Đã xóa `authInstances` khỏi dependency array

    // loadAndRenderData phải được khai báo sau refreshData và getActiveUserEmail
    const loadAndRenderData = useCallback(async (email: string | null) => {
        const cached = sessionStorage.getItem('studentActivities');
        const cachedProject = sessionStorage.getItem('cachedProject');

        if (cached && currentProjectKey === cachedProject) {
            try {
                setCachedData(JSON.parse(cached));
                return;
            } catch (err: unknown) {
                console.warn("Lỗi phân tích cú pháp cache, đang lấy dữ liệu mới", err);
            }
        }
        await refreshData(email);
    }, [currentProjectKey, refreshData]); // Thêm refreshData vào dependencies

    // handlePostAuthState phải được khai báo sau loadAndRenderData và getActiveUserEmail
    const handlePostAuthState = useCallback((user: FirebaseAuthUser | null, projectKey: string) => {
        if (user && currentProjectKey === projectKey) {
            loadAndRenderData(getActiveUserEmail());
            setShowLoginPage(false);
        } else if (!signedInUsers.projectA && !signedInUsers.projectB && isAuthReady) {
            setShowLoginPage(true);
        }
    }, [currentProjectKey, signedInUsers, isAuthReady, loadAndRenderData, getActiveUserEmail]);


    // --- FIREBASE INITIALIZATION ---
    useEffect(() => {
        const initFirebase = async () => {
            const apps: Record<string, FirebaseApp> = {};
            const auths: Record<string, Auth> = {};
            const dbs: Record<string, Firestore> = {};

            // Initialize Project A
            if (!getApps().some(app => app.name === 'projectA')) {
                apps.projectA = initializeApp(firebaseConfigA, 'projectA');
            } else {
                apps.projectA = getApps().find(app => app.name === 'projectA') as FirebaseApp;
            }
            auths.projectA = getAuth(apps.projectA);
            dbs.projectA = getFirestore(apps.projectA);

            // Initialize Project B
            if (!getApps().some(app => app.name === 'projectB')) {
                apps.projectB = initializeApp(firebaseConfigB, 'projectB');
            } else {
                apps.projectB = getApps().find(app => app.name === 'projectB') as FirebaseApp;
            }
            auths.projectB = getAuth(apps.projectB);
            dbs.projectB = getFirestore(apps.projectB);

            setFirebaseApps(apps);
            setAuthInstances(auths);
            setFirestoreDbs(dbs);

            // Set up auth state listeners
            onAuthStateChanged(auths.projectA, (user) => {
                setSignedInUsers(prev => ({ ...prev, projectA: user }));
                if (currentProjectKey === 'projectA') {
                    handlePostAuthState(user, 'projectA');
                }
            });

            onAuthStateChanged(auths.projectB, (user) => {
                setSignedInUsers(prev => ({ ...prev, projectB: user }));
                if (currentProjectKey === 'projectB') {
                    handlePostAuthState(user, 'projectB');
                }
            });

            // Handle initial custom token sign-in or anonymous sign-in
            try {
                if (__initial_auth_token && auths.projectA) {
                    await signInWithCustomToken(auths.projectA, __initial_auth_token);
                    console.log("Đã đăng nhập bằng custom token cho Project A.");
                } else if (auths.projectA) {
                    await signInAnonymously(auths.projectA);
                    console.log("Đã đăng nhập ẩn danh cho Project A.");
                }
            } catch (error: unknown) {
                console.error("Xác thực thất bại:", error);
            } finally {
                setIsAuthReady(true);
            }
        };

        initFirebase();
    }, [currentProjectKey, handlePostAuthState, authInstances]); // `authInstances` needs to be here if its reference changes

    // Cập nhật currentDb khi currentProjectKey thay đổi
    useEffect(() => {
        if (firestoreDbs[currentProjectKey]) {
            setCurrentDb(firestoreDbs[currentProjectKey]);
        }
    }, [currentProjectKey, firestoreDbs]);

    // Effect để kích hoạt tải dữ liệu khi currentDb hoặc người dùng hoạt động thay đổi
    useEffect(() => {
        let unsubscribeRef: (() => void) | undefined; // Dùng biến cục bộ để lưu hàm unsubscribe

        const setupDataListener = async () => {
            if (currentDb && isAuthReady) {
                const userEmail = getActiveUserEmail();
                if (userEmail) {
                    const result = await refreshData(userEmail);
                    unsubscribeRef = result; // Gán hàm cleanup vào biến cục bộ
                } else {
                    setCachedData([]);
                }
            }
        };

        setupDataListener(); // Gọi hàm async setup listener

        // Hàm cleanup của useEffect phải là đồng bộ
        return () => {
            if (unsubscribeRef && typeof unsubscribeRef === 'function') {
                unsubscribeRef(); // Gọi hàm cleanup thực sự
            }
        };
    }, [currentDb, isAuthReady, getActiveUserEmail, refreshData]);


    // --- PROJECT SWITCHING LOGIC ---
    const ensureSignedInForProject = useCallback(async (projectKey: string) => {
        if (signedInUsers[projectKey]) {
            console.log(`Người dùng đã đăng nhập vào Project ${projectKey}.`);
            return true;
        }
        console.log(`Người dùng chưa đăng nhập vào Project ${projectKey}. Đang cố gắng đăng nhập tự động...`);
        const success = await signInForProject(authInstances[projectKey], projectKey);
        return success;
    }, [signedInUsers, authInstances]); // SỬA LỖI: Đã bỏ eslint-disable nếu linter không cảnh báo nữa

    const switchProject = useCallback(async (projectKey: 'projectA' | 'projectB') => { // eslint-disable-line @typescript-eslint/no-unused-vars
        if (currentProjectKey === projectKey) {
            console.log(`Đã ở Project ${projectKey}. Không cần chuyển đổi.`);
            return;
        }

        console.log(`Đang yêu cầu chuyển đổi sang Project: ${projectKey}`);
        const signedIn = await ensureSignedInForProject(projectKey);

        if (!signedIn) {
            console.error(`Không thể chuyển sang Project ${projectKey} vì đăng nhập thất bại.`);
            return;
        }

        setCurrentProjectKey(projectKey);
        sessionStorage.setItem('currentProject', projectKey);
        console.log(`Đã chuyển sang Project: ${projectKey}`);
    }, [currentProjectKey, ensureSignedInForProject, authInstances]);

    // --- RENDERING & UI HELPERS ---
    const getStatusClass = useCallback((status: string | undefined): string => { // eslint-disable-line @typescript-eslint/no-unused-vars
        switch (status) {
            case 'Phê duyệt':
            case 'Sent':
                return 'bg-green-100 text-green-700';
            case 'Đang xử lý':
            case 'Processing':
                return 'bg-yellow-100 text-yellow-700';
            case 'Từ chối':
            case 'Cancelled':
                return 'bg-red-100 text-red-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    }, []);

    const calculateClassification = useCallback((userActivities: Activity[]) => {
        const cond1Keywords = ["cán bộ", "Ban chấp hành", "gương mẫu", "hoàn thành tốt", "Đoàn", "Hội"];
        const cond2Keywords = ["Nghiên cứu khoa học", "Dự án khoa học"];
        const cond3Keywords = ["CLB học thuật", "Hội thảo học thuật"];

        let conditionsMet = 0;

        const metCond1 = userActivities.some(activity =>
            cond1Keywords.some(keyword =>
                String(activity['Tên hoạt động'] || '').toLowerCase().includes(keyword.toLowerCase())
            )
        );
        if (metCond1) conditionsMet++;

        const metCond2 = userActivities.some(activity =>
            cond2Keywords.some(keyword =>
                String(activity['Tên hoạt động'] || '').toLowerCase().includes(keyword.toLowerCase())
            )
            && String(activity.Status || '').toLowerCase() === 'phê duyệt'
        );
        if (metCond2) conditionsMet++;

        const metCond3 = userActivities.some(activity =>
            cond3Keywords.some(keyword =>
                String(activity['Tên hoạt động'] || '').toLowerCase().includes(keyword.toLowerCase())
            )
            && String(activity.Status || '').toLowerCase() === 'phê duyệt'
        );
        if (metCond3) conditionsMet++;

        let group = "";
        if (conditionsMet === 0) {
            group = "Nhóm 90";
        } else if (conditionsMet === 1) {
            group = "Nhóm 95";
        } else {
            group = "Nhóm 100";
        }

        return { points: conditionsMet, group: group };
    }, []);

    // --- SORTING & FILTERING ---
    const sortData = useCallback((data: Activity[]) => {
        return [...data].sort((a, b) => {
            const valA = a[currentSort.key] ?? '';
            const valB = b[currentSort.key] ?? '';

            if (currentSort.key === 'Điểm cộng') {
                const numA = Number.isFinite(parseFloat(String(valA).replace(',', '.'))) ? parseFloat(String(valA).replace(',', '.')) : -Infinity;
                const numB = Number.isFinite(parseFloat(String(valB).replace(',', '.'))) ? parseFloat(String(valB).replace(',', '.')) : -Infinity;
                return currentSort.order === 'asc' ? numA - numB : numB - numA;
            }

            const aStr = String(valA).toLowerCase();
            const bStr = String(valB).toLowerCase();
            if (aStr < bStr) return currentSort.order === 'asc' ? -1 : 1;
            if (aStr > bStr) return currentSort.order === 'asc' ? 1 : -1;
            return 0;
        });
    }, [currentSort]);

    const filteredAndSortedData = useMemo((): Activity[] => { // eslint-disable-line @typescript-eslint/no-unused-vars
        const filtered = cachedData.filter(item => {
            return Object.values(item || {}).some(value =>
                String(value || '').toLowerCase().includes(filterText.toLowerCase())
            );
        });
        return sortData(filtered);
    }, [cachedData, filterText, sortData]);

    // --- STATS CALCULATION ---
    const stats = useMemo((): Stats => { // eslint-disable-line @typescript-eslint/no-unused-vars
        const totalActivities = cachedData.length;

        const sentCount = cachedData.filter(a => a.Status === 'Phê duyệt').length;
        const processingCount = cachedData.filter(a => a.Status === 'Đang chờ').length;
        const cancelledCount = cachedData.filter(a => a.Status === 'Không phê duyệt').length;

        const totalPoints = cachedData.reduce((sum, activity) => {
            const raw = activity['Điểm cộng'];
            const n = parseFloat(String(raw).replace(',', '.'));
            return sum + (Number.isFinite(n) ? n : 0);
        }, 0);

        const approvedActivities = cachedData.filter(activity =>
            activity.Status === 'Phê duyệt'
        );
        
        const totalApprovedPoints = approvedActivities.reduce((sum, activity) => {
            const raw = activity['Điểm cộng'];
            const n = parseFloat(String(raw).replace(',', '.'));
            return sum + (Number.isFinite(n) ? n : 0);
        }, 0);

        const classificationResult = cachedData.length > 0 ? calculateClassification(cachedData) : { group: "N/A" };
        
        console.log("Mảng hoạt động đã được phê duyệt:", approvedActivities);
        console.log("Tổng điểm đã phê duyệt:", totalApprovedPoints);
        
        return {
            totalActivities,
            sentCount,
            processingCount,
            cancelledCount,
            totalPoints: totalPoints.toFixed(2),
            totalApprovedPoints: totalApprovedPoints.toFixed(2),
            classificationGroup: classificationResult.group,
        };
    }, [cachedData, calculateClassification]);


    const activeUser: User | null = signedInUsers[currentProjectKey] ? {
        uid: signedInUsers[currentProjectKey]!.uid,
        displayName: signedInUsers[currentProjectKey]!.displayName,
        email: signedInUsers[currentProjectKey]!.email,
        photoURL: signedInUsers[currentProjectKey]!.photoURL
    } : null;

    return (
        <html lang="vi">
            <body>
                <div className="antialiased text-gray-800">
                    {/* Các style tùy chỉnh toàn cục nên được đặt trong app/globals.css */}
                    {showLoginPage ? (
                        <LoginPage />
                    ) : (
                        <div id="dashboard-page">
                            <DashboardHeader
                                user={activeUser}
                                onSignOut={() => signOutAll(authInstances.projectA, authInstances.projectB)}
                            />

                            <main className="container mx-auto py-4 px-4">
                                {children} 
                            </main>
                        </div>
                    )}
                </div>
            </body>
        </html>
    );
}
