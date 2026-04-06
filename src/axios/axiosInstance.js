import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — tự động gắn token vào mọi request
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error),
);

// Response interceptor — xử lý lỗi tập trung
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;

        if (status === 401) {
            // Token hết hạn hoặc không hợp lệ → xóa và về trang đăng nhập
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/sign-in';
        }

        return Promise.reject(error);
    },
);

export default axiosInstance;
