// src/firestore.js
import { collection, query, where, onSnapshot } from "firebase/firestore";

/**
 * Lấy dữ liệu hoạt động sinh viên từ Firestore trong thời gian thực.
 * Sử dụng onSnapshot để lắng nghe các thay đổi.
 * @param {Firestore} db Instance Firestore hiện tại.
 * @param {string} email Email của người dùng hiện tại để lọc dữ liệu.
 * @param {string} currentProjectKey Khóa của project hiện tại (để log).
 * @param {function} onData Callback khi dữ liệu được tải hoặc thay đổi.
 * @param {function} onError Callback khi có lỗi xảy ra.
 * @returns {function} Hàm hủy đăng ký listener Firestore.
 */
export function fetchDashboardData(db, email, currentProjectKey, onData, onError) {
    // Logic đã được khôi phục về trạng thái ban đầu
    if (!db || !email) {
        onError(new Error("Database instance or email is missing."));
        return () => {}; 
    }

    const activitiesCol = collection(db, "studentActivities");
    
    // Lọc dữ liệu dựa trên email của người dùng đang đăng nhập
    const q = query(activitiesCol, where("Email", "==", email));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const activities = [];
        querySnapshot.forEach((doc) => {
            activities.push({ id: doc.id, ...doc.data() });
        });
        onData(activities);
    }, (error) => {
        handleFirestoreError(error);
        onError(error);
    });

    return unsubscribe; // Trả về hàm để hủy đăng ký listener
}

/**
 * Xử lý lỗi Firestore bằng cách ghi log vào console.
 * @param {object} error Đối tượng lỗi Firestore.
 */
function handleFirestoreError(error) {
    const code = String(error?.code || '').toLowerCase();
    const message = String(error?.message || '').toLowerCase();

    if (code.includes('resource-exhausted') || message.includes('quota') || message.includes('exhausted')) {
        console.error("Lỗi Firestore: Kho dữ liệu hiện tại đang quá tải (hết quota).", error);
    } else if (code.includes('permission-denied') || message.includes('permission-denied')) {
        console.error("Lỗi Firestore: Không có quyền truy cập dữ liệu cho kho này. Vui lòng kiểm tra Rules hoặc đăng nhập lại.", error);
    } else {
        console.error("Lỗi Firestore: Không thể tải dữ liệu từ server. Vui lòng kiểm tra kết nối.", error);
    }
}