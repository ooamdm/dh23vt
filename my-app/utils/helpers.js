// src/utils/helpers.js

/**
 * Trả về lớp CSS phù hợp dựa trên trạng thái hoạt động.
 * @param {string} status Trạng thái hoạt động.
 * @returns {string} Lớp CSS Tailwind.
 */
export function getStatusClass(status) {
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
}

/**
 * Tính toán phân loại sinh viên dựa trên các hoạt động đã cho.
 * @param {Array<object>} userActivities Mảng các đối tượng hoạt động.
 * @returns {object} Đối tượng chứa số điểm và nhóm phân loại.
 */
export function calculateClassification(userActivities) {
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
        && String(activity.Status || '').toLowerCase() === 'phê duyệt' // Only approved research counts
    );
    if (metCond2) conditionsMet++;

    const metCond3 = userActivities.some(activity =>
        cond3Keywords.some(keyword =>
            String(activity['Tên hoạt động'] || '').toLowerCase().includes(keyword.toLowerCase())
        )
        && String(activity.Status || '').toLowerCase() === 'phê duyệt' // Only approved academic club counts
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
}

/**
 * Chuyển đổi ký tự HTML đặc biệt thành thực thể HTML để tránh XSS.
 * @param {string} unsafe Chuỗi cần thoát.
 * @returns {string} Chuỗi đã được thoát.
 */
export function escapeHtml(unsafe) {
    return String(unsafe)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}