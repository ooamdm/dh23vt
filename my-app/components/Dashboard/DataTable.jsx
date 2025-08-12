// src/components/DataTable.jsx
import React from 'react';
import { escapeHtml } from '@/utils/helpers'; // Import hàm tiện ích

function DataTable({
    filterText,
    setFilterText,
    onRefresh,
    isLoading,
    currentProjectKey,
    switchProject,
    filteredAndSortedData,
    currentSort,
    setCurrentSort,
    getStatusClass
}) {
    return (
        <div className="bg-white p-4 rounded-xl shadow-lg">
            {/* Phần Header, Search, Refresh không thay đổi */}
            <div className="flex flex-col md:flex-row items-center justify-between mb-4">
                <div className="w-full md:w-1/2">
                    <h2 className="text-xl font-bold mb-3 md:mb-0">Danh sách hoạt động</h2>
                </div>
                <div className="w-full md:w-1/2 flex flex-col sm:flex-row items-center search-refresh-group">
                    <div className="relative flex-grow w-full sm:mr-2 mb-2 sm:mb-0">
                        <input
                            type="text"
                            id="filter-input"
                            placeholder="Lọc theo tên, MSSV, file..."
                            className="form-control rounded-lg w-full pl-4 pr-10 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={filterText}
                            onChange={(e) => setFilterText(e.target.value)}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <i className="fas fa-search"></i>
                        </span>
                    </div>
                    <button
                        id="refresh-btn"
                        className="btn btn-success btn-custom w-full sm:w-auto px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                        onClick={onRefresh}
                        disabled={isLoading}
                    >
                        <i className="fas fa-sync-alt mr-2"></i>Làm mới
                    </button>
                </div>
            </div>

            {/* Phần chọn Project không thay đổi */}
            <div className="flex flex-wrap justify-end items-center mb-4 project-selector">
                <span className="text-gray-600 font-semibold mr-2 mb-2 sm:mb-0">Chọn Kho dữ liệu:</span>
                <button
                    id="project-a-btn"
                    className={`btn btn-sm mb-2 mr-2 px-4 py-2 rounded-lg ${currentProjectKey === 'projectA' ? 'bg-blue-100 text-blue-800' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    onClick={() => switchProject('projectA')}
                >
                    Project A
                </button>
                <button
                    id="project-b-btn"
                    className={`btn btn-sm mb-2 mr-2 px-4 py-2 rounded-lg ${currentProjectKey === 'projectB' ? 'bg-blue-100 text-blue-800' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    onClick={() => switchProject('projectB')}
                >
                    Project B
                </button>
            </div>

            {/* Loading Spinner và No Data Message không thay đổi */}
            {isLoading && (
                <div id="loading-spinner" className="text-center py-5">
                    <i className="fas fa-spinner fa-spin text-4xl text-blue-500"></i>
                    <p className="mt-2 text-gray-600">Đang tải dữ liệu...</p>
                </div>
            )}
            {!isLoading && filteredAndSortedData.length === 0 && (
                <p id="no-data-message" className="text-center py-5 text-gray-500">Không tìm thấy hoạt động nào.</p>
            )}

            {/* Data Table - Đã được cập nhật */}
            {!isLoading && filteredAndSortedData.length > 0 && (
                // Container này sẽ tạo thanh cuộn ngang nếu cần
                <div id="table-container" className="overflow-x-auto rounded-lg shadow-sm border border-gray-200">
                    {/* SỬA 1: Thêm class `table-fixed` và `w-full` */}
                    <table className="min-w-full divide-y divide-gray-200 bg-white table-fixed w-full">
                        <thead className="bg-gray-100">
                            <tr>
                                {/* SỬA 2: Thêm class chiều rộng cho các cột (ví dụ: w-4/12) */}
                                <th
                                    className="p-3 w-4/12 font-semibold text-left text-sm text-gray-600 uppercase tracking-wider th-sortable"
                                    onClick={() => setCurrentSort(prev => ({ key: 'Tên hoạt động', order: (prev.key === 'Tên hoạt động' && prev.order === 'asc') ? 'desc' : 'asc' }))}
                                >
                                    Tên hoạt động
                                    <i className={`fas sort-icon ${currentSort.key === 'Tên hoạt động' ? (currentSort.order === 'asc' ? 'fa-sort-up' : 'fa-sort-down') : 'fa-sort'}`}></i>
                                </th>
                                <th
                                    className="p-3 w-4/12 font-semibold text-left text-sm text-gray-600 uppercase tracking-wider th-sortable"
                                    onClick={() => setCurrentSort(prev => ({ key: 'File upload', order: (prev.key === 'File upload' && prev.order === 'asc') ? 'desc' : 'asc' }))}
                                >
                                    File Upload
                                    <i className={`fas sort-icon ${currentSort.key === 'File upload' ? (currentSort.order === 'asc' ? 'fa-sort-up' : 'fa-sort-down') : 'fa-sort'}`}></i>
                                </th>
                                <th
                                    className="p-3 w-2/12 font-semibold text-left text-sm text-gray-600 uppercase tracking-wider th-sortable"
                                    onClick={() => setCurrentSort(prev => ({ key: 'Điểm cộng', order: (prev.key === 'Điểm cộng' && prev.order === 'asc') ? 'desc' : 'asc' }))}
                                >
                                    Điểm cộng
                                    <i className={`fas sort-icon ${currentSort.key === 'Điểm cộng' ? (currentSort.order === 'asc' ? 'fa-sort-up' : 'fa-sort-down') : 'fa-sort'}`}></i>
                                </th>
                                <th
                                    className="p-3 w-2/12 font-semibold text-left text-sm text-gray-600 uppercase tracking-wider th-sortable"
                                    onClick={() => setCurrentSort(prev => ({ key: 'Status', order: (prev.key === 'Status' && prev.order === 'asc') ? 'desc' : 'asc' }))}
                                >
                                    Trạng thái
                                    <i className={`fas sort-icon ${currentSort.key === 'Status' ? (currentSort.order === 'asc' ? 'fa-sort-up' : 'fa-sort-down') : 'fa-sort'}`}></i>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredAndSortedData.map(activity => {
                                const fileUploadValue = activity['File upload'];
                                const links = fileUploadValue
                                    ? String(fileUploadValue).split(/\s*,\s*/).map(l => l.trim()).filter(l => l && (l.startsWith('http://') || l.startsWith('https://')))
                                    : [];
                                return (
                                    <tr key={activity.id} className="hover:bg-gray-50">
                                        {/* SỬA 3: Bỏ `whitespace-nowrap` và thêm `break-words` */}
                                        <td className="p-3 break-words">{escapeHtml(activity['Tên hoạt động'] || '')}</td>
                                        <td className="p-3 break-words">
                                            {links.length > 0 ? (
                                                links.map((link, index) => {
                                                    const fileName = decodeURIComponent(link.substring(link.lastIndexOf('/') + 1));
                                                    return (
                                                        <a
                                                            key={index}
                                                            href={link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="block mb-1 text-blue-500 hover:text-blue-700 font-medium"
                                                        >
                                                            <i className="fas fa-file-alt mr-2"></i>{fileName}
                                                        </a>
                                                    );
                                                })
                                            ) : (
                                                escapeHtml(String(fileUploadValue || ''))
                                            )}
                                        </td>
                                        <td className="p-3">{escapeHtml(String(activity['Điểm cộng'] ?? ''))}</td>
                                        <td className="p-3">
                                            <span className={`px-2 py-1 font-semibold leading-tight rounded-full ${getStatusClass(activity.Status)}`}>
                                                {escapeHtml(activity.Status || '')}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default DataTable;
