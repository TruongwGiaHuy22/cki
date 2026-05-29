import axios from 'axios';

// Đây là "địa chỉ nhà" của Backend - nơi xử lý dữ liệu
const API_URL = 'http://localhost:4000/maychu/admin'; 

// Hàm này giúp lấy danh sách truyện đang chờ duyệt
export const fetchPendingNovels = async () => {
    return await axios.get(`${API_URL}/pending`);
};

// Hàm này giúp gửi lệnh duyệt truyện về cho Backend
export const approveNovel = async (idln) => {
    return await axios.patch(`${API_URL}/approve/${idln}`);
};