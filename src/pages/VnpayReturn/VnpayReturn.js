import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './VnpayReturn.module.scss';
import { useCart } from '../../contexts/CartContext';

const cx = classNames.bind(styles);

const RESPONSE_MESSAGES = {
    '00': { text: 'Thanh toán thành công!', type: 'success' },
    '07': {
        text: 'Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường).',
        type: 'warning',
    },
    '09': { text: 'Thẻ/Tài khoản chưa đăng ký dịch vụ Internet Banking tại ngân hàng.', type: 'error' },
    10: { text: 'Xác thực thông tin thẻ/tài khoản không đúng quá 3 lần.', type: 'error' },
    11: { text: 'Đã hết hạn chờ thanh toán. Vui lòng thực hiện lại giao dịch.', type: 'error' },
    12: { text: 'Thẻ/Tài khoản bị khóa.', type: 'error' },
    13: { text: 'Sai mật khẩu OTP. Vui lòng thực hiện lại giao dịch.', type: 'error' },
    24: { text: 'Giao dịch đã bị hủy.', type: 'cancelled' },
    51: { text: 'Tài khoản không đủ số dư để thực hiện giao dịch.', type: 'error' },
    65: { text: 'Tài khoản đã vượt quá hạn mức giao dịch trong ngày.', type: 'error' },
    75: { text: 'Ngân hàng thanh toán đang bảo trì.', type: 'error' },
    79: { text: 'Sai mật khẩu thanh toán quá số lần quy định. Vui lòng thực hiện lại giao dịch.', type: 'error' },
    99: { text: 'Lỗi không xác định. Vui lòng liên hệ hỗ trợ.', type: 'error' },
};

function VnpayReturn() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(8);
    const { clearCart } = useCart();

    const status = searchParams.get('status');
    const orderNumber = searchParams.get('orderNumber');
    const responseCode = searchParams.get('vnp_ResponseCode');

    // Xác định loại kết quả
    const isSuccess = status === 'success' || responseCode === '00';
    const isCancelled = status === 'failed' && (responseCode === '24' || !responseCode);
    const isInvalid = status === 'invalid';
    const isNotFound = status === 'notfound';

    const msgInfo = responseCode ? RESPONSE_MESSAGES[responseCode] || RESPONSE_MESSAGES['99'] : null;

    // Nếu huỷ hoặc thất bại → tự động quay về giỏ hàng ngay
    useEffect(() => {
        if (isSuccess) return;
        navigate('/cart', { replace: true });
    }, [isSuccess, navigate]);

    // Clear cart và auto redirect khi thanh toán thành công
    useEffect(() => {
        if (!isSuccess) return;
        // Clear cart vì đã thanh toán xong
        clearCart();
        const timer = setInterval(() => {
            setCountdown((c) => {
                if (c <= 1) {
                    clearInterval(timer);
                    navigate(`/order-tracking?q=${orderNumber}`);
                }
                return c - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [isSuccess, navigate, orderNumber, clearCart]);

    const getIcon = () => {
        if (isSuccess) return '✓';
        if (isCancelled) return '✕';
        return '!';
    };

    const getTitle = () => {
        if (isSuccess) return 'Thanh toán thành công!';
        if (isCancelled) return 'Giao dịch đã bị hủy';
        if (isInvalid) return 'Giao dịch không hợp lệ';
        if (isNotFound) return 'Không tìm thấy đơn hàng';
        return 'Thanh toán thất bại';
    };

    const getSubtitle = () => {
        if (isSuccess) return `Đơn hàng #${orderNumber} đã được thanh toán và đang được xác nhận.`;
        if (msgInfo) return msgInfo.text;
        if (isCancelled) return 'Bạn đã hủy giao dịch thanh toán. Đơn hàng vẫn được giữ lại.';
        if (isInvalid) return 'Chữ ký giao dịch không hợp lệ. Vui lòng liên hệ hỗ trợ.';
        return 'Đã có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.';
    };

    return (
        <div className={cx('wrapper')}>
            <div
                className={cx('card', {
                    success: isSuccess,
                    error: !isSuccess && !isCancelled,
                    cancelled: isCancelled,
                })}
            >
                {/* Logo VNPay */}
                <div className={cx('vnpay-badge')}>
                    <span className={cx('vnpay-text')}>VNPay</span>
                </div>

                {/* Icon trạng thái */}
                <div
                    className={cx('status-icon', {
                        'icon-success': isSuccess,
                        'icon-error': !isSuccess && !isCancelled,
                        'icon-cancelled': isCancelled,
                    })}
                >
                    <span>{getIcon()}</span>
                </div>

                {/* Tiêu đề */}
                <h1 className={cx('title', { 'title-success': isSuccess })}>{getTitle()}</h1>

                {/* Mô tả */}
                <p className={cx('subtitle')}>{getSubtitle()}</p>

                {/* Thông tin đơn hàng */}
                {orderNumber && (
                    <div className={cx('order-info')}>
                        <div className={cx('info-row')}>
                            <span className={cx('info-label')}>Mã đơn hàng</span>
                            <span className={cx('info-value', 'order-number')}>#{orderNumber}</span>
                        </div>
                        {responseCode && (
                            <div className={cx('info-row')}>
                                <span className={cx('info-label')}>Mã phản hồi</span>
                                <span className={cx('info-value')}>{responseCode}</span>
                            </div>
                        )}
                        <div className={cx('info-row')}>
                            <span className={cx('info-label')}>Cổng thanh toán</span>
                            <span className={cx('info-value')}>VNPay Sandbox</span>
                        </div>
                    </div>
                )}

                {/* Countdown khi thành công */}
                {isSuccess && (
                    <p className={cx('countdown')}>
                        Tự động chuyển đến theo dõi đơn hàng sau <strong>{countdown}s</strong>
                    </p>
                )}

                {/* Actions */}
                <div className={cx('actions')}>
                    {isSuccess ? (
                        <>
                            <button
                                className={cx('btn', 'btn-primary')}
                                onClick={() => navigate(`/order-tracking?q=${orderNumber}`)}
                            >
                                Theo dõi đơn hàng
                            </button>
                            <Link to="/" className={cx('btn', 'btn-secondary')}>
                                Về trang chủ
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link to="/cart" className={cx('btn', 'btn-primary')}>
                                Thử lại thanh toán
                            </Link>
                            {orderNumber && (
                                <button
                                    className={cx('btn', 'btn-secondary')}
                                    onClick={() => navigate(`/order-tracking?q=${orderNumber}`)}
                                >
                                    Xem đơn hàng
                                </button>
                            )}
                            <Link to="/" className={cx('btn', 'btn-ghost')}>
                                Về trang chủ
                            </Link>
                        </>
                    )}
                </div>

                {/* Sandbox notice */}
                <div className={cx('sandbox-notice')}>
                    <span>🧪</span>
                    <span>Đây là môi trường TEST của VNPay Sandbox</span>
                </div>
            </div>
        </div>
    );
}

export default VnpayReturn;
