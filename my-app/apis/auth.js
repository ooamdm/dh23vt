// src/auth.js
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

/**
 * Đăng nhập người dùng bằng Google cho một project Firebase cụ thể.
 * @param {FirebaseAuth} authInstance Instance Firebase Auth cho project đó.
 * @param {string} projectKey Khóa của project (e.g., 'projectA', 'projectB').
 * @returns {Promise<boolean>} Trả về true nếu đăng nhập thành công, false nếu thất bại.
 */
export async function signInForProject(authInstance, projectKey) {
    const provider = new GoogleAuthProvider();
    try {
        await signInWithPopup(authInstance, provider);
        return true;
    } catch (err) {
        console.error(`Error signing in for ${projectKey}:`, err);
        return false;
    }
}

/**
 * Đăng xuất khỏi tất cả các project Firebase đã cung cấp.
 * @param {FirebaseAuth} authA Instance Firebase Auth cho Project A.
 * @param {FirebaseAuth} authB Instance Firebase Auth cho Project B.
 */
export async function signOutAll(authA, authB) {
    try {
        await Promise.all([
            signOut(authA).catch(() => {}), // Bắt lỗi nếu một auth instance không tồn tại
            signOut(authB).catch(() => {})
        ]);
    } catch (err) {
        console.warn("Lỗi khi đăng xuất: ", err);
    } finally {
        sessionStorage.removeItem('studentActivities');
        sessionStorage.removeItem('cachedProject');
        sessionStorage.removeItem('currentProject');
        console.log("Đã đăng xuất khỏi cả hai project và xoá cache.");
        // Lưu ý: State trong React sẽ được cập nhật thông qua onAuthStateChanged listeners trong App.js
    }
}