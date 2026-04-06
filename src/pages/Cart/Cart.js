import { useState } from 'react';
import classNames from 'classnames/bind';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Cart.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCartShopping, faMinus, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import axiosInstance from '../../axios/axiosInstance';

const cx = classNames.bind(styles);

const formatPrice = (price) => new Intl.NumberFormat('vi-VN').format(price) + ' đ';

const DELIVERY_FEE = 15000;
const TAX_RATE = 0.1;

// ── Modal nhập thông tin đặt hàng ──────────────────────────
function CheckoutModal({ onClose, onConfirm, loading }) {
    const { user } = useAuth();
    const [form, setForm] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        email: user?.email || '',
        street: '',
        city: '',
        notes: '',
        paymentMethod: 'cash',
        orderType: 'delivery',
    });
    const [error, setError] = useState('');

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = () => {
        if (!form.name.trim() || !form.phone.trim()) {
            setError('Vui lòng nhập họ tên và số điện thoại.');
            return;
        }
        if (form.orderType === 'delivery' && !form.street.trim()) {
            setError('Vui lòng nhập địa chỉ giao hàng.');
            return;
        }
        onConfirm(form);
    };

    return (
        <div className={cx('modal-overlay')} onClick={onClose}>
            <div className={cx('modal')} onClick={(e) => e.stopPropagation()}>
                <h3 className={cx('modal-title')}>Thông tin đặt hàng</h3>

                <div className={cx('modal-form')}>
                    <div className={cx('modal-row')}>
                        <label>Hình thức</label>
                        <div className={cx('radio-group')}>
                            {['delivery', 'takeaway'].map((type) => (
                                <label key={type} className={cx('radio-label')}>
                                    <input
                                        type="radio"
                                        name="orderType"
                                        value={type}
                                        checked={form.orderType === type}
                                        onChange={handleChange}
                                    />
                                    {type === 'delivery' ? 'Giao hàng' : 'Mang đi'}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className={cx('modal-row')}>
                        <label>Họ tên *</label>
                        <input
                            className={cx('modal-input')}
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Nhập họ tên"
                        />
                    </div>

                    <div className={cx('modal-row')}>
                        <label>Số điện thoại *</label>
                        <input
                            className={cx('modal-input')}
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            placeholder="Nhập số điện thoại"
                        />
                    </div>

                    <div className={cx('modal-row')}>
                        <label>Email</label>
                        <input
                            className={cx('modal-input')}
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="Nhập email (tuỳ chọn)"
                        />
                    </div>

                    {form.orderType === 'delivery' && (
                        <>
                            <div className={cx('modal-row')}>
                                <label>Địa chỉ *</label>
                                <input
                                    className={cx('modal-input')}
                                    name="street"
                                    value={form.street}
                                    onChange={handleChange}
                                    placeholder="Số nhà, tên đường"
                                />
                            </div>
                            <div className={cx('modal-row')}>
                                <label>Quận / Thành phố</label>
                                <input
                                    className={cx('modal-input')}
                                    name="city"
                                    value={form.city}
                                    onChange={handleChange}
                                    placeholder="Quận / Thành phố"
                                />
                            </div>
                        </>
                    )}

                    <div className={cx('modal-row')}>
                        <label>Thanh toán</label>
                        <select
                            className={cx('modal-input')}
                            name="paymentMethod"
                            value={form.paymentMethod}
                            onChange={handleChange}
                        >
                            <option value="cash">Tiền mặt khi nhận hàng</option>
                            <option value="vnpay">VNPay</option>
                            <option value="momo">MoMo</option>
                            <option value="zalopay">ZaloPay</option>
                            <option value="card">Thẻ ngân hàng</option>
                        </select>
                    </div>

                    <div className={cx('modal-row')}>
                        <label>Ghi chú</label>
                        <textarea
                            className={cx('modal-input', 'modal-textarea')}
                            name="notes"
                            value={form.notes}
                            onChange={handleChange}
                            placeholder="Yêu cầu đặc biệt..."
                            rows={2}
                        />
                    </div>
                </div>

                {error && <p className={cx('modal-error')}>{error}</p>}

                <div className={cx('modal-actions')}>
                    <button className={cx('modal-btn-cancel')} onClick={onClose}>
                        Huỷ
                    </button>
                    <button className={cx('modal-btn-confirm', { loading })} onClick={handleSubmit} disabled={loading}>
                        {loading ? 'Đang đặt...' : 'Xác nhận đặt hàng'}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Main Cart component ────────────────────────────────────
function Cart() {
    const { items, totalItems, subtotal, removeItem, updateQuantity, clearCart, buildOrderPayload } = useCart();
    const navigate = useNavigate();

    const [showModal, setShowModal] = useState(false);
    const [ordering, setOrdering] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(null);

    // Coupon
    const [couponInput, setCouponInput] = useState('');
    const [coupon, setCoupon] = useState(null); // { code, discount, description }
    const [couponLoading, setCouponLoading] = useState(false);
    const [couponError, setCouponError] = useState('');

    // Muỗng nĩa nhựa
    const [wantUtensils, setWantUtensils] = useState(false);
    const UTENSILS_FEE = 2000;

    const deliveryFee = items.length > 0 ? DELIVERY_FEE : 0;
    const utensilsFee = wantUtensils ? UTENSILS_FEE : 0;
    const tax = subtotal * TAX_RATE;
    const discount = coupon?.discount || 0;
    const total = Math.max(0, subtotal + tax + deliveryFee + utensilsFee - discount);

    const handleApplyCoupon = async () => {
        if (!couponInput.trim()) return;
        setCouponLoading(true);
        setCouponError('');
        try {
            const res = await axiosInstance.post('/coupons/validate', {
                code: couponInput.trim(),
                subtotal,
            });
            setCoupon(res.data.data);
            setCouponError('');
        } catch (err) {
            setCoupon(null);
            setCouponError(err.response?.data?.message || 'Mã không hợp lệ.');
        } finally {
            setCouponLoading(false);
        }
    };

    const handleRemoveCoupon = () => {
        setCoupon(null);
        setCouponInput('');
        setCouponError('');
    };

    const handleConfirmOrder = async (formData) => {
        setOrdering(true);
        try {
            const payload = buildOrderPayload({
                customerInfo: {
                    name: formData.name,
                    phone: formData.phone,
                    email: formData.email,
                    address: {
                        street: formData.street,
                        city: formData.city,
                    },
                },
                paymentMethod: formData.paymentMethod,
                orderType: formData.orderType,
                notes: formData.notes,
            });

            // Gửi couponCode lên backend
            if (coupon) payload.couponCode = coupon.code;

            const res = await axiosInstance.post('/orders', payload);
            const orderId = res.data.data?._id;
            const orderNumber = res.data.data?.orderNumber;

            // Nếu chọn VNPay → redirect sang trang thanh toán, KHÔNG clear cart
            // Cart sẽ được clear sau khi thanh toán thành công ở trang VnpayReturn
            if (formData.paymentMethod === 'vnpay') {
                const vnRes = await axiosInstance.post('/payment/vnpay-create', { orderId });
                if (vnRes.data.payUrl) {
                    setShowModal(false);
                    window.location.href = vnRes.data.payUrl;
                    return;
                }
            }

            // Các phương thức khác → clear cart bình thường
            clearCart();
            setCoupon(null);
            setCouponInput('');
            setShowModal(false);
            setOrderSuccess(orderNumber);
        } catch (err) {
            alert(err.response?.data?.message || 'Đặt hàng thất bại, vui lòng thử lại.');
        } finally {
            setOrdering(false);
        }
    };

    // ── Màn hình đặt hàng thành công ──
    if (orderSuccess) {
        return (
            <div className={cx('wrapper')}>
                <div className={cx('success-screen')}>
                    <div className={cx('success-icon')}>🎉</div>
                    <h2 className={cx('success-title')}>Đặt hàng thành công!</h2>
                    <p className={cx('success-order')}>
                        Mã đơn hàng: <strong>{orderSuccess}</strong>
                    </p>
                    <p className={cx('success-note')}>Dùng mã này để theo dõi đơn tại trang Theo dõi đơn hàng.</p>
                    <div className={cx('success-actions')}>
                        <button className={cx('success-btn-track')} onClick={() => navigate('/order-tracking')}>
                            Theo dõi đơn hàng
                        </button>
                        <button className={cx('success-btn-home')} onClick={() => navigate('/')}>
                            Về trang chủ
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={cx('wrapper')}>
            {/* Header */}
            <div className={cx('header')}>
                <Link to="/" className={cx('btn-back')}>
                    <FontAwesomeIcon icon={faArrowLeft} className={cx('icon')} />
                    <p>Trở lại</p>
                </Link>
                <div className={cx('title')}>
                    <p>GIỎ HÀNG CỦA TÔI</p>
                </div>
            </div>

            <div className={cx('content')}>
                {/* ── Cột trái: danh sách sản phẩm ── */}
                <div className={cx('main', { 'main-has-items': items.length > 0 })}>
                    {items.length === 0 ? (
                        // Giỏ trống
                        <>
                            <FontAwesomeIcon icon={faCartShopping} className={cx('cart-icon')} />
                            <p>Giỏ hàng của bạn trống</p>
                            <p>Tại sao không thử một vài món trong</p>
                            <Link to="/" className={cx('back-home')}>
                                món ăn của chúng tôi?
                            </Link>
                        </>
                    ) : (
                        // Danh sách items
                        <div className={cx('item-list')}>
                            {items.map((item) => (
                                <div key={item.cartKey} className={cx('cart-item')}>
                                    <img
                                        src={item.image || '/assets/image/placeholder.webp'}
                                        alt={item.name}
                                        className={cx('cart-item-img')}
                                    />
                                    <div className={cx('cart-item-info')}>
                                        <p className={cx('cart-item-name')}>{item.name}</p>
                                        {item.size && (
                                            <p className={cx('cart-item-meta')}>
                                                Cỡ: {item.size}
                                                {item.crust ? ` · Đế: ${item.crust}` : ''}
                                            </p>
                                        )}
                                        {item.toppings?.length > 0 && (
                                            <p className={cx('cart-item-meta')}>
                                                Topping: {item.toppings.map((t) => t.name).join(', ')}
                                            </p>
                                        )}
                                        <p className={cx('cart-item-price')}>{formatPrice(item.unitPrice)}</p>
                                    </div>
                                    <div className={cx('cart-item-actions')}>
                                        {/* Điều chỉnh số lượng */}
                                        <div className={cx('qty-box')}>
                                            <button
                                                className={cx('qty-btn')}
                                                onClick={() => updateQuantity(item.cartKey, item.quantity - 1)}
                                            >
                                                <FontAwesomeIcon icon={faMinus} />
                                            </button>
                                            <span className={cx('qty-value')}>{item.quantity}</span>
                                            <button
                                                className={cx('qty-btn')}
                                                onClick={() => updateQuantity(item.cartKey, item.quantity + 1)}
                                            >
                                                <FontAwesomeIcon icon={faPlus} />
                                            </button>
                                        </div>
                                        {/* Subtotal item */}
                                        <p className={cx('cart-item-subtotal')}>
                                            {formatPrice(item.unitPrice * item.quantity)}
                                        </p>
                                        {/* Xoá */}
                                        <button className={cx('btn-remove')} onClick={() => removeItem(item.cartKey)}>
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* ── Cột phải: tóm tắt & thanh toán ── */}
                <div className={cx('check-out')}>
                    <div className={cx('voucher-box')}>
                        {coupon ? (
                            // Đã áp dụng mã
                            <div className={cx('coupon-applied')}>
                                <div className={cx('coupon-info')}>
                                    <span className={cx('coupon-tag')}>🎉</span>
                                    <div>
                                        <p className={cx('coupon-code')}>{coupon.code}</p>
                                        <p className={cx('coupon-desc')}>
                                            {coupon.description || `Giảm ${formatPrice(coupon.discount)}`}
                                        </p>
                                    </div>
                                </div>
                                <button className={cx('coupon-remove')} onClick={handleRemoveCoupon}>
                                    ✕
                                </button>
                            </div>
                        ) : (
                            // Chưa áp dụng mã
                            <div className={cx('coupon-input-wrap')}>
                                <div className={cx('voucher-title')}>Mã giảm giá</div>
                                <div className={cx('coupon-row')}>
                                    <input
                                        className={cx('coupon-input')}
                                        placeholder="Nhập mã giảm giá"
                                        value={couponInput}
                                        onChange={(e) => {
                                            setCouponInput(e.target.value.toUpperCase());
                                            setCouponError('');
                                        }}
                                        onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                                    />
                                    <button
                                        className={cx('coupon-btn', { 'coupon-btn-active': couponInput.trim() })}
                                        onClick={handleApplyCoupon}
                                        disabled={couponLoading || !couponInput.trim()}
                                    >
                                        {couponLoading ? '...' : 'Áp dụng'}
                                    </button>
                                </div>
                                {couponError && <p className={cx('coupon-error')}>{couponError}</p>}
                            </div>
                        )}
                    </div>

                    <div className={cx('plastic-box')} onClick={() => setWantUtensils((v) => !v)}>
                        <div className={cx('plastic-title')}>
                            Muỗng Nĩa Nhựa <span className={cx('plastic-fee')}>(+2.000đ)</span>
                        </div>
                        <div className={cx('plastic-icon')}>
                            <p className={cx({ 'plastic-yes': wantUtensils })}>{wantUtensils ? 'Có' : 'Không'}</p>
                            <div className={cx('plastic-toggle', { 'plastic-toggle-on': wantUtensils })} />
                        </div>
                    </div>

                    {/* Tổng tiền — số thật từ CartContext */}
                    <div className={cx('total-box')}>
                        <div className={cx('total-info')}>
                            <div className={cx('info-item')}>
                                <p>Tạm tính ({totalItems} món)</p>
                                <p>{formatPrice(subtotal)}</p>
                            </div>
                            <div className={cx('info-item')}>
                                <p>Thuế VAT (10%)</p>
                                <p>{formatPrice(tax)}</p>
                            </div>
                            <div className={cx('info-item')}>
                                <p>Phí giao hàng</p>
                                <p>{items.length > 0 ? formatPrice(deliveryFee) : '0 đ'}</p>
                            </div>
                            {wantUtensils && (
                                <div className={cx('info-item')}>
                                    <p>Muỗng nĩa nhựa</p>
                                    <p>{formatPrice(UTENSILS_FEE)}</p>
                                </div>
                            )}
                            {discount > 0 && (
                                <div className={cx('info-item', 'info-discount')}>
                                    <p>Giảm giá ({coupon?.code})</p>
                                    <p>-{formatPrice(discount)}</p>
                                </div>
                            )}
                        </div>
                        <div className={cx('total-final')}>
                            <p>Tổng cộng</p>
                            <p className={cx('total-count')}>{formatPrice(total)}</p>
                        </div>
                    </div>

                    {/* Nút thanh toán — active khi có hàng */}
                    <div
                        className={cx('pay', { 'pay-active': items.length > 0 })}
                        onClick={() => items.length > 0 && setShowModal(true)}
                    >
                        Thanh Toán
                    </div>
                </div>
            </div>

            {/* Modal nhập thông tin */}
            {showModal && (
                <CheckoutModal onClose={() => setShowModal(false)} onConfirm={handleConfirmOrder} loading={ordering} />
            )}
        </div>
    );
}

export default Cart;
