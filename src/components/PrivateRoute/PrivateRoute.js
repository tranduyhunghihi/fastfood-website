import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// Chặn route nếu chưa đăng nhập, redirect về /sign-in
// Sau khi đăng nhập xong sẽ quay lại trang cũ nhờ state.from
function PrivateRoute({ children }) {
    const { isLoggedIn, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        // Đang kiểm tra token, chưa render gì
        return null;
    }

    if (!isLoggedIn) {
        return <Navigate to="/sign-in" state={{ from: location }} replace />;
    }

    return children;
}

export default PrivateRoute;
