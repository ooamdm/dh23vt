// src/App.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInWithCustomToken, signInAnonymously } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Import các cấu hình Firebase của bạn
// Bạn sẽ cần tạo một file firebase-configs.js trong thư mục src
import { firebaseConfigA, firebaseConfigB } from './firebase-configs';

// Import các hàm xác thực và cơ sở dữ liệu từ các file mới
import { signInForProject, signOutAll } from './auth';
import { fetchDashboardData } from './firestore';

// Import các components (bây giờ là .jsx)
import LoginScreen from './components/LoginScreen.jsx';
import DashboardHeader from './components/DashboardHeader.jsx';
import StatsCards from './components/StatsCards.jsx';
import DataTable from './components/DataTable.jsx';

// Global variables provided by the Canvas environment
const __app_id = typeof window.__app_id !== 'undefined' ? window.__app_id : 'default-app-id';
const __firebase_config = typeof window.__firebase_config !== 'undefined' ? JSON.parse(window.__firebase_config) : null;
const __initial_auth_token = typeof window.__initial_auth_token !== 'undefined' ? window.__initial_auth_token : null;


function App() {
    // --- STATE MANAGEMENT ---
    const [firebaseApps, setFirebaseApps] = useState({});
    const [authInstances, setAuthInstances] = useState({});
    const [firestoreDbs, setFirestoreDbs] = useState({});
    const [currentProjectKey, setCurrentProjectKey] = useState(sessionStorage.getItem('currentProject') || 'projectA');
    const [currentDb, setCurrentDb] = useState(null);
    const [signedInUsers, setSignedInUsers] = useState({ projectA: null, projectB: null });
    const [cachedData, setCachedData] = useState([]);
    const [currentSort, setCurrentSort] = useState({ key: 'Tên hoạt động', order: 'asc' });
    const [filterText, setFilterText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isAuthReady, setIsAuthReady] = useState(false); // Để theo dõi quá trình khởi tạo xác thực Firebase

    // --- FIREBASE INITIALIZATION ---
    useEffect(() => {
        const initFirebase = async () => {
            const apps = {};
            const auths = {};
            const dbs = {};

            // Initialize Project A
            if (!getApps().some(app => app.name === 'projectA')) {
                apps.projectA = initializeApp(firebaseConfigA, 'projectA');
            } else {
                apps.projectA = getApps().find(app => app.name === 'projectA');
            }
            auths.projectA = getAuth(apps.projectA);
            dbs.projectA = getFirestore(apps.projectA);

            // Initialize Project B
            if (!getApps().some(app => app.name === 'projectB')) {
                apps.projectB = initializeApp(firebaseConfigB, 'projectB');
            } else {
                apps.projectB = getApps().find(app => app.name === 'projectB');
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
                if (__initial_auth_token && auths.projectA) { // Giả định token ban đầu dành cho projectA là chính
                    await signInWithCustomToken(auths.projectA, __initial_auth_token);
                    console.log("Đã đăng nhập bằng custom token cho Project A.");
                } else if (auths.projectA) {
                    await signInAnonymously(auths.projectA);
                    console.log("Đã đăng nhập ẩn danh cho Project A.");
                }
            } catch (error) {
                console.error("Xác thực thất bại:", error);
            } finally {
                setIsAuthReady(true);
            }
        };

        initFirebase();
    }, []); // Chỉ chạy một lần khi component được mount

    // Cập nhật currentDb khi currentProjectKey thay đổi
    useEffect(() => {
        if (firestoreDbs[currentProjectKey]) {
            setCurrentDb(firestoreDbs[currentProjectKey]);
        }
    }, [currentProjectKey, firestoreDbs]);

    // --- AUTHENTICATION HELPERS ---
    const handlePostAuthState = useCallback((user, projectKey) => {
        if (user && currentProjectKey === projectKey) {
            loadAndRenderData(getActiveUserEmail());
        } else if (!signedInUsers.projectA && !signedInUsers.projectB && isAuthReady) {
            // Không có người dùng nào ở cả hai project sau khi auth sẵn sàng, hiển thị màn hình đăng nhập
            // Logic này được xử lý ngầm bởi điều kiện render trong JSX
        }
    }, [currentProjectKey, signedInUsers, isAuthReady]);

    const getActiveUserEmail = useCallback(() => {
        const user = signedInUsers[currentProjectKey];
        return user ? user.email : null;
    }, [currentProjectKey, signedInUsers]);

    // --- DATA HANDLING ---
    const loadAndRenderData = useCallback(async (email) => {
        const cached = sessionStorage.getItem('studentActivities');
        const cachedProject = sessionStorage.getItem('cachedProject');

        if (cached && currentProjectKey === cachedProject) {
            try {
                setCachedData(JSON.parse(cached));
                return;
            } catch (err) {
                console.warn("Lỗi phân tích cú pháp cache, đang lấy dữ liệu mới", err);
            }
        }
        await refreshData(email);
    }, [currentProjectKey]);

    const refreshData = useCallback(async (email) => {
        if (!email || !currentDb) {
            console.error("Lỗi: Không có email hoặc cơ sở dữ liệu để tải dữ liệu.");
            setIsLoading(false);
            return;
        }

        console.log(`Đang lấy dữ liệu mới từ Firestore Project: ${currentProjectKey}...`);
        setIsLoading(true);

        const auth = authInstances[currentProjectKey];
        if (!auth.currentUser) {
            console.warn(`Người dùng chưa đăng nhập vào Project ${currentProjectKey}. Đang cố gắng đăng nhập.`);
            const signedIn = await signInForProject(authInstances[currentProjectKey], currentProjectKey);
            if (!signedIn) {
                console.error(`Không thể lấy dữ liệu vì đăng nhập vào Project ${currentProjectKey} thất bại.`);
                setIsLoading(false);
                return;
            }
        }

        // Gọi hàm fetchDashboardData từ file firestore.js
        const unsubscribe = fetchDashboardData(currentDb, email, currentProjectKey, (activities) => {
            setCachedData(activities);
            sessionStorage.setItem('studentActivities', JSON.stringify(activities));
            sessionStorage.setItem('cachedProject', currentProjectKey);
            console.log("Dữ liệu đã được làm mới và lưu vào cache.");
            setIsLoading(false);
        }, (error) => {
            console.error("Lỗi khi lắng nghe dữ liệu từ Firestore: ", error);
            setIsLoading(false);
        });

        return () => unsubscribe(); // Clean up listener
    }, [currentProjectKey, currentDb, authInstances]);

    // Effect để kích hoạt tải dữ liệu khi currentDb hoặc người dùng hoạt động thay đổi
    useEffect(() => {
        if (currentDb && isAuthReady) {
            const userEmail = getActiveUserEmail();
            if (userEmail) {
                const unsubscribe = refreshData(userEmail);
                return () => {
                    if (unsubscribe && typeof unsubscribe === 'function') {
                        unsubscribe(); // Dọn dẹp listener khi unmount hoặc dependency thay đổi
                    }
                };
            } else {
                setCachedData([]); // Xóa dữ liệu nếu không có người dùng đăng nhập
            }
        }
    }, [currentDb, isAuthReady, getActiveUserEmail, refreshData]);

    // --- PROJECT SWITCHING LOGIC ---
    const ensureSignedInForProject = useCallback(async (projectKey) => {
        if (signedInUsers[projectKey]) {
            console.log(`Người dùng đã đăng nhập vào Project ${projectKey}.`);
            return true;
        }
        console.log(`Người dùng chưa đăng nhập vào Project ${projectKey}. Đang cố gắng đăng nhập tự động...`);
        const success = await signInForProject(authInstances[projectKey], projectKey);
        return success;
    }, [signedInUsers, authInstances]);

    const switchProject = useCallback(async (projectKey) => {
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
        // currentDb sẽ được cập nhật bởi hook useEffect
        // Tải dữ liệu được xử lý bởi useEffect cho currentDb và người dùng hoạt động
        console.log(`Đã chuyển sang Project: ${projectKey}`);
    }, [currentProjectKey, ensureSignedInForProject, authInstances]);

    // --- RENDERING & UI HELPERS ---
    const getStatusClass = useCallback((status) => {
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

    const calculateClassification = useCallback((userActivities) => {
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
            && String(activity.Status || '').toLowerCase() === 'phê duyệt' // Chỉ tính nghiên cứu đã được phê duyệt
        );
        if (metCond2) conditionsMet++;

        const metCond3 = userActivities.some(activity =>
            cond3Keywords.some(keyword =>
                String(activity['Tên hoạt động'] || '').toLowerCase().includes(keyword.toLowerCase())
            )
            && String(activity.Status || '').toLowerCase() === 'phê duyệt' // Chỉ tính CLB học thuật đã được phê duyệt
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
    const sortData = useCallback((data) => {
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

    const filteredAndSortedData = React.useMemo(() => {
        const filtered = cachedData.filter(item => {
            return Object.values(item || {}).some(value =>
                String(value || '').toLowerCase().includes(filterText.toLowerCase())
            );
        });
        return sortData(filtered);
    }, [cachedData, filterText, sortData]);

    // --- STATS CALCULATION ---
const stats = React.useMemo(() => {
    const totalActivities = cachedData.length;

    // Chỉ đếm các hoạt động có Status là 'Phê duyệt'
    const sentCount = cachedData.filter(a => a.Status === 'Phê duyệt').length;

    // Chỉ đếm các hoạt động có Status là 'Đang chờ'
    const processingCount = cachedData.filter(a => a.Status === 'Đang chờ').length;

    // Chỉ đếm các hoạt động có Status là 'Không phê duyệt'
    const cancelledCount = cachedData.filter(a => a.Status === 'Không phê duyệt').length;

    // Tính tổng điểm của TẤT CẢ các hoạt động
    const totalPoints = cachedData.reduce((sum, activity) => {
        const raw = activity['Điểm cộng'];
        const n = parseFloat(String(raw).replace(',', '.'));
        return sum + (Number.isFinite(n) ? n : 0);
    }, 0);

    // Lọc chỉ những hoạt động có Status là 'Phê duyệt'
    const approvedActivities = cachedData.filter(activity =>
        activity.Status === 'Phê duyệt'
    );
    
    // Tính tổng điểm của những hoạt động đã được phê duyệt
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

    const activeUser = signedInUsers[currentProjectKey];
    const showLoginScreen = !activeUser && isAuthReady;
    
    console.log("DỮ LIỆU THẬT:", filteredAndSortedData);
    return (
        <div className="antialiased text-gray-800">
            {/* Custom Styles (có thể di chuyển sang style.css) */}
            <style>
                {`
                body {
                    font-family: 'Inter', sans-serif;
                    background-color: #f3f4f6; /* gray-100 */
                }
                ::-webkit-scrollbar {
                    width: 8px;
                }
                ::-webkit-scrollbar-track {
                    background: #f1f1f1;
                }
                ::-webkit-scrollbar-thumb {
                    background: #888;
                    border-radius: 10px;
                }
                ::-webkit-scrollbar-thumb:hover {
                    background: #555;
                }
                .sort-icon {
                    opacity: 0.5;
                    transition: opacity 0.2s;
                    margin-left: 0.5rem;
                }
                .sort-icon:hover {
                    opacity: 1;
                }
                .th-sortable {
                    cursor: pointer;
                }
                .card-custom {
                    transition: transform 0.2s ease-in-out;
                }
                .card-custom:hover {
                    transform: translateY(-5px);
                }
                .btn-custom {
                    padding: 10px 20px;
                    border-radius: 8px;
                    font-weight: 600;
                }
                .btn-google {
                    background-color: #4285F4;
                    color: white;
                }
                .btn-google:hover {
                    background-color: #357AE8;
                }
                @media (max-width: 575.98px) {
                    .search-refresh-group .input-group {
                        width: 100%;
                        margin-bottom: 1rem;
                    }
                    .search-refresh-group .btn {
                        width: 100%;
                    }
                    .project-selector .btn {
                        margin-bottom: 0.5rem;
                    }
                }
                `}
            </style>

            {showLoginScreen ? (
                <LoginScreen onSignIn={() => signInForProject(authInstances[currentProjectKey], currentProjectKey)} />
            ) : (
                <div id="dashboard-screen">
                    <DashboardHeader
                        user={activeUser}
                        onSignOut={() => signOutAll(authInstances.projectA, authInstances.projectB)}
                    />

                    <main className="container mx-auto py-4 px-4">
                        <StatsCards stats={stats} />

                        <DataTable
                            filterText={filterText}
                            setFilterText={setFilterText}
                            onRefresh={() => refreshData(activeUser?.email)}
                            isLoading={isLoading}
                            currentProjectKey={currentProjectKey}
                            switchProject={switchProject}
                            filteredAndSortedData={filteredAndSortedData}
                            currentSort={currentSort}
                            setCurrentSort={setCurrentSort}
                            getStatusClass={getStatusClass}
                        />
                    </main>
                </div>
            )}
        </div>
    );
}

export default App;
