import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axiosInstance from '../axios/axiosInstance';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // đang kiểm tra token lúc khởi động

    // Khi app load lần đầu, fetch user mới nhất từ DB
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setLoading(false);
            return;
        }

        axiosInstance
            .get('/auth/me')
            .then((res) => {
                const userData = res.data.data;
                localStorage.setItem('user', JSON.stringify(userData));
                setUser(userData);
            })
            .catch(() => {
                // Token hết hạn hoặc không hợp lệ
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setUser(null);
            })
            .finally(() => setLoading(false));
    }, []);

    const login = useCallback(async (email, password) => {
        const res = await axiosInstance.post('/auth/login', { email, password });
        const { token, ...userData } = res.data.data;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);

        return userData;
    }, []);

    const register = useCallback(async (name, email, password) => {
        const res = await axiosInstance.post('/auth/register', { name, email, password });
        const { token, ...userData } = res.data.data;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);

        return userData;
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('chat_session'); // ← xóa session chat khi đăng xuất
        setUser(null);
    }, []);

    const updateUser = useCallback(
        (newData) => {
            const updated = { ...user, ...newData };
            localStorage.setItem('user', JSON.stringify(updated));
            setUser(updated);
        },
        [user],
    );

    const isAdmin = user?.role === 'admin';
    const isLoggedIn = !!user;

    return (
        <AuthContext.Provider value={{ user, loading, isLoggedIn, isAdmin, login, register, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth phải dùng trong AuthProvider');
    return ctx;
}

export default AuthContext;
