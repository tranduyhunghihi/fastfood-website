import { useState, useEffect, useCallback } from 'react';
import classNames from 'classnames/bind';
import { Link, useSearchParams } from 'react-router-dom';
import styles from './Order.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faBoxOpen } from '@fortawesome/free-solid-svg-icons';
import axiosInstance from '../../axios/axiosInstance';

const cx = classNames.bind(styles);

const formatPrice = (price) => new Intl.NumberFormat('vi-VN').format(price) + ' đ';

const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

// Trạng thái đơn hàng theo thứ tự
const STATUS_STEPS = [
    { key: 'pending', label: 'Chờ xác nhận' },
    { key: 'confirmed', label: 'Đã xác nhận' },
    { key: 'preparing', label: 'Đang chuẩn bị' },
    { key: 'delivering', label: 'Đang giao' },
    { key: 'delivered', label: 'Đã giao' },
];

const PAYMENT_LABEL = {
    cash: 'Tiền mặt',
    card: 'Thẻ ngân hàng',
    momo: 'MoMo',
    zalopay: 'ZaloPay',
    vnpay: 'VNPay',
};

const ORDER_TYPE_LABEL = {
    delivery: 'Giao hàng',
    takeaway: 'Mang đi',
    dinein: 'Tại chỗ',
};

// Thanh tiến trình trạng thái
function StatusBar({ status }) {
    if (status === 'cancelled') {
        return <div className={cx('status-cancelled')}>Đơn hàng đã bị huỷ</div>;
    }

    const currentIndex = STATUS_STEPS.findIndex((s) => s.key === status);

    return (
        <div className={cx('status-bar')}>
            {STATUS_STEPS.map((step, index) => (
                <div key={step.key} className={cx('status-step')}>
                    <div
                        className={cx('step-dot', {
                            'step-done': index < currentIndex,
                            'step-active': index === currentIndex,
                        })}
                    >
                        {index < currentIndex ? '✓' : index + 1}
                    </div>
                    <p
                        className={cx('step-label', {
                            'step-label-active': index <= currentIndex,
                        })}
                    >
                        {step.label}
                    </p>
                    {index < STATUS_STEPS.length - 1 && (
                        <div className={cx('step-line', { 'step-line-done': index < currentIndex })} />
                    )}
                </div>
            ))}
        </div>
    );
}

// Card hiển thị 1 đơn hàng
function OrderCard({ order }) {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className={cx('order-card')}>
            {/* Header card */}
            <div className={cx('card-header')} onClick={() => setExpanded(!expanded)}>
                <div className={cx('card-header-left')}>
                    <p className={cx('order-number')}>#{order.orderNumber}</p>
                    <p className={cx('order-date')}>{formatDate(order.createdAt)}</p>
                </div>
                <div className={cx('card-header-right')}>
                    <p className={cx('order-total')}>{formatPrice(order.total)}</p>
                    <span className={cx('toggle-btn')}>{expanded ? '▲' : '▼'}</span>
                </div>
            </div>

            {/* Thanh trạng thái */}
            <StatusBar status={order.status} />

            {/* Chi tiết mở rộng */}
            {expanded && (
                <div className={cx('card-detail')}>
                    <div className={cx('detail-row')}>
                        <span>Hình thức:</span>
                        <span>{ORDER_TYPE_LABEL[order.orderType] || order.orderType}</span>
                    </div>
                    <div className={cx('detail-row')}>
                        <span>Thanh toán:</span>
                        <span>{PAYMENT_LABEL[order.paymentMethod] || order.paymentMethod}</span>
                    </div>
                    {order.customerInfo?.address?.street && (
                        <div className={cx('detail-row')}>
                            <span>Địa chỉ:</span>
                            <span>
                                {order.customerInfo.address.street}
                                {order.customerInfo.address.city ? `, ${order.customerInfo.address.city}` : ''}
                            </span>
                        </div>
                    )}

                    {/* Danh sách items */}
                    <div className={cx('items-list')}>
                        {order.items?.map((item, i) => (
                            <div key={i} className={cx('item-row')}>
                                <span className={cx('item-name')}>
                                    {item.name}
                                    {item.productDetails?.size ? ` (${item.productDetails.size})` : ''}
                                </span>
                                <span className={cx('item-qty')}>x{item.quantity}</span>
                                <span className={cx('item-price')}>{formatPrice(item.subtotal)}</span>
                            </div>
                        ))}
                    </div>

                    {/* Tóm tắt giá */}
                    <div className={cx('price-summary')}>
                        <div className={cx('price-row')}>
                            <span>Tạm tính</span>
                            <span>{formatPrice(order.subtotal)}</span>
                        </div>
                        {order.tax > 0 && (
                            <div className={cx('price-row')}>
                                <span>Thuế</span>
                                <span>{formatPrice(order.tax)}</span>
                            </div>
                        )}
                        {order.deliveryFee > 0 && (
                            <div className={cx('price-row')}>
                                <span>Phí giao hàng</span>
                                <span>{formatPrice(order.deliveryFee)}</span>
                            </div>
                        )}
                        <div className={cx('price-row', 'price-total')}>
                            <span>Tổng cộng</span>
                            <span>{formatPrice(order.total)}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ── Main Order page ────────────────────────────
function Order() {
    const [searchParams] = useSearchParams();
    const [query, setQuery] = useState(searchParams.get('q') || '');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [error, setError] = useState('');

    const handleSearchWith = useCallback(async (value) => {
        const trimmed = (value || '').trim();
        if (!trimmed) return;
        setLoading(true);
        setError('');
        setOrders([]);
        try {
            const isOrderNumber = trimmed.toUpperCase().startsWith('ORD');
            const params = isOrderNumber ? { orderNumber: trimmed.toUpperCase() } : { phone: trimmed };
            const res = await axiosInstance.get('/orders/track', { params });
            setOrders(res.data.data || []);
            setSearched(true);
        } catch (err) {
            if (err.response?.status === 404) {
                setOrders([]);
                setSearched(true);
            } else {
                setError(err.response?.data?.message || 'Đã có lỗi xảy ra, vui lòng thử lại.');
            }
        } finally {
            setLoading(false);
        }
    }, []);

    // Auto-search khi có query param ?q=... (từ redirect VNPay)
    useEffect(() => {
        const q = searchParams.get('q');
        if (q) {
            handleSearchWith(q);
        }
    }, [searchParams, handleSearchWith]);

    const handleSearch = () => handleSearchWith(query);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSearch();
    };

    return (
        <div className={cx('wrapper')}>
            {/* Header */}
            <div className={cx('header')}>
                <Link to="/" className={cx('btn-back')}>
                    <FontAwesomeIcon icon={faArrowLeft} className={cx('icon')} />
                    <p>Trở lại</p>
                </Link>
                <div className={cx('title')}>
                    <p>Theo Dõi Đơn Hàng</p>
                </div>
            </div>

            <div className={cx('content')}>
                <div className={cx('main')}>
                    <p className={cx('heading')}>Nhập số điện thoại hoặc mã đơn hàng (VD: ORD250320...)</p>
                    <div className={cx('container')}>
                        <input
                            className={cx('input-box')}
                            placeholder="SĐT hoặc mã đơn hàng"
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value);
                                setError('');
                            }}
                            onKeyDown={handleKeyDown}
                        />
                        <div className={cx('btn-search')} onClick={handleSearch}>
                            {loading ? 'Đang tìm...' : 'Tìm kiếm'}
                        </div>
                    </div>

                    {error && <p className={cx('error')}>{error}</p>}

                    {/* Kết quả */}
                    {searched && (
                        <div className={cx('results')}>
                            {orders.length === 0 ? (
                                <div className={cx('empty')}>
                                    <FontAwesomeIcon icon={faBoxOpen} className={cx('empty-icon')} />
                                    <p>Không tìm thấy đơn hàng nào.</p>
                                    <p className={cx('empty-hint')}>Kiểm tra lại số điện thoại hoặc mã đơn hàng.</p>
                                </div>
                            ) : (
                                <>
                                    <p className={cx('result-count')}>Tìm thấy {orders.length} đơn hàng</p>
                                    {orders.map((order) => (
                                        <OrderCard key={order._id} order={order} />
                                    ))}
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Order;
