// src/components/Dashboard/StatsCards.tsx
import React, { useState } from 'react';

// Định nghĩa interface cho props của AccordionItem
interface AccordionItemProps {
    title: string;
    children: React.ReactNode;
    isOpen: boolean;
    onClick: () => void;
}

// Thành phần con cho mỗi mục accordion
const AccordionItem: React.FC<AccordionItemProps> = ({ title, children, isOpen, onClick }) => {
    return (
        <div className="border border-gray-200 rounded-xl mb-2 overflow-hidden shadow-sm">
            {/* Tiêu đề accordion, có thể click để đóng/mở */}
            <button
                className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 focus:outline-none transition-all duration-300 rounded-t-xl"
                onClick={onClick}
                aria-expanded={isOpen}
            >
                <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                {/* Icon mũi tên xoay khi mở/đóng */}
                <i className={`fas fa-chevron-down text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}></i>
            </button>
            {/* Nội dung accordion, hiển thị/ẩn tùy thuộc vào trạng thái isOpen */}
            <div
                className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-screen opacity-100 p-4' : 'max-h-0 opacity-0 p-0'}`}
                style={{ overflow: 'hidden' }} // Đảm bảo nội dung bị cắt khi ẩn
            >
                {/* Chỉ hiển thị nội dung nếu isOpen là true */}
                {isOpen && children}
            </div>
        </div>
    );
};

// Định nghĩa interface cho props của StatsCards
interface StatsCardsProps {
    stats: {
        totalActivities: number;
        sentCount: number;
        processingCount: number;
        cancelledCount: number;
        totalPoints: string;
        totalApprovedPoints: string;
        classificationGroup: string;
    };
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
    // State để quản lý mục accordion nào đang mở
    const [openItem, setOpenItem] = useState<string | null>('summary');

    // Hàm xử lý việc đóng/mở mục accordion
    const handleToggle = (item: string) => {
        setOpenItem(prevOpenItem => prevOpenItem === item ? null : item);
    };

    return (
        <div className="container mx-auto px-4 py-6">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">Thống Kê Hoạt Động</h2>

            {/* Accordion cho phần Tổng Kết Điểm và Xếp Loại */}
            <AccordionItem
                title="Tổng Kết Điểm"
                isOpen={openItem === 'summary'}
                onClick={() => handleToggle('summary')}
            >
                <div className="bg-white p-4 rounded-xl flex flex-col space-y-4">
                    <div className="flex items-center">
                        <div className="bg-purple-100 p-3 rounded-full mr-3">
                            <i className="fas fa-medal text-2xl text-purple-500"></i>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-0">Tổng Điểm Cộng Hoạt Động</p>
                            <p id="total-points" className="text-2xl font-bold mb-0">{stats.totalApprovedPoints}</p>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <div className="bg-pink-100 p-3 rounded-full mr-3">
                            <i className="fas fa-chart-simple text-2xl text-pink-500"></i>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-0">Nhóm điểm xếp loại của bạn</p>
                            <p id="classification-group" className="text-2xl font-bold mb-0">{stats.classificationGroup}</p>
                        </div>
                    </div>
                </div>
            </AccordionItem>

            {/* Accordion cho phần Tình Trạng Hoạt Động */}
            <AccordionItem
                title="Tình Trạng Hoạt Động"
                isOpen={openItem === 'status'}
                onClick={() => handleToggle('status')}
            >
                <div className="bg-white p-4 rounded-xl grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center">
                        <div className="bg-blue-100 p-3 rounded-full mr-3">
                            <i className="fas fa-list-check text-2xl text-blue-500"></i>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-0">Tổng Hoạt Động</p>
                            <p id="total-activities" className="text-2xl font-bold mb-0">{stats.totalActivities}</p>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <div className="bg-green-100 p-3 rounded-full mr-3">
                            <i className="fas fa-check-circle text-2xl text-green-500"></i>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-0">Đã Gửi</p>
                            <p id="sent-activities" className="text-2xl font-bold mb-0">{stats.sentCount}</p>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <div className="bg-yellow-100 p-3 rounded-full mr-3">
                            <i className="fas fa-hourglass-half text-2xl text-yellow-500"></i>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-0">Đang Chờ Xử Lý</p>
                            <p id="processing-activities" className="text-2xl font-bold mb-0">{stats.processingCount}</p>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <div className="bg-red-100 p-3 rounded-full mr-3">
                            <i className="fas fa-times-circle text-2xl text-red-500"></i>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-0">Bị Hủy</p>
                            <p id="cancelled-activities" className="text-2xl font-bold mb-0">{stats.cancelledCount}</p>
                        </div>
                    </div>
                </div>
            </AccordionItem>
        </div>
    );
};

export default StatsCards;
