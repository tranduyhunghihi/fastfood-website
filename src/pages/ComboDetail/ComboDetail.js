import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faCartShopping, faTag, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import styles from './ComboDetail.module.scss';
import axiosInstance from '../../axios/axiosInstance';
import { useCart } from '../../contexts/CartContext';

const cx = classNames.bind(styles);

const formatPrice = (price) => new Intl.NumberFormat('vi-VN').format(price) + ' đ';

const SIZE_LABEL = { small: 'Nhỏ', medium: 'Vừa', large: 'Lớn', family: 'Gia đình' };

function ComboDetail() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { addItem } = useCart();

    const [combo, setCombo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);

    useEffect(() => {
        setLoading(true);
        setError('');
        axiosInstance
            .get('/combos/' + slug)
            .then((res) => setCombo(res.data.data))
            .catch(() => setError('Không tìm thấy combo.'))
            .finally(() => setLoading(false));
    }, [slug]);

    const handleAddToCart = () => {
        addItem({
            itemId: combo._id,
            itemType: 'combo',
            name: combo.name,
            image: combo.image || '',
            unitPrice: combo.price,
            quantity,
        });
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    // ── Skeleton ──
    if (loading) {
        return (
            <div className={cx('wrapper')}>
                <div className={cx('skeleton-wrap')}>
                    <div className={cx('skeleton-img')} />
                    <div className={cx('skeleton-info')}>
                        {[80, 60, 50, 40].map((w, i) => (
                            <div key={i} className={cx('skeleton-line')} style={{ width: w + '%' }} />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error || !combo) {
        return (
            <div className={cx('wrapper', 'error-wrap')}>
                <p className={cx('error-msg')}>{error || 'Combo không tồn tại.'}</p>
                <button className={cx('btn-back-home')} onClick={() => navigate('/')}>
                    Về trang chủ
                </button>
            </div>
        );
    }

    return (
        <div className={cx('wrapper')}>
            {/* Back bar */}
            <div className={cx('back-bar')}>
                <span className={cx('back-btn')} onClick={() => navigate(-1)}>
                    <FontAwesomeIcon icon={faAngleLeft} />
                    Quay lại
                </span>
                <span className={cx('breadcrumb')}>
                    <Link to="/">Trang chủ</Link>
                    <span className={cx('sep')}>/</span>
                    <span>Combo</span>
                    <span className={cx('sep')}>/</span>
                    <span className={cx('breadcrumb-current')}>{combo.name}</span>
                </span>
            </div>

            {/* Main */}
            <div className={cx('main')}>
                {/* Ảnh */}
                <div className={cx('col-left')}>
                    <div className={cx('img-wrap')}>
                        <img
                            src={combo.image || '/assets/image/placeholder.webp'}
                            alt={combo.name}
                            className={cx('combo-img')}
                        />
                        {combo.discountPercent > 0 && (
                            <span className={cx('badge-discount')}>-{combo.discountPercent}%</span>
                        )}
                    </div>
                </div>

                {/* Info */}
                <div className={cx('col-right')}>
                    <div className={cx('info-header')}>
                        <span className={cx('badge-combo')}>COMBO</span>
                        <h1 className={cx('combo-name')}>{combo.name}</h1>
                        {combo.description && <p className={cx('description')}>{combo.description}</p>}

                        <div className={cx('price-block')}>
                            {combo.originalPrice > combo.price && (
                                <p className={cx('price-original')}>{formatPrice(combo.originalPrice)}</p>
                            )}
                            <div className={cx('price-row')}>
                                <FontAwesomeIcon icon={faTag} className={cx('tag-icon')} />
                                <p className={cx('price-current')}>{formatPrice(combo.price)}</p>
                            </div>
                            {combo.savings > 0 && (
                                <p className={cx('savings')}>Tiết kiệm {formatPrice(combo.savings)}</p>
                            )}
                        </div>
                    </div>

                    {/* Danh sách món trong combo */}
                    {combo.items && combo.items.length > 0 && (
                        <div className={cx('items-block')}>
                            <p className={cx('items-title')}>Bao gồm</p>
                            <div className={cx('items-list')}>
                                {combo.items.map((item, i) => (
                                    <div key={i} className={cx('item-row')}>
                                        <div className={cx('item-left')}>
                                            {item.product?.images?.[0] && (
                                                <img
                                                    src={item.product.images[0]}
                                                    alt={item.product.name}
                                                    className={cx('item-img')}
                                                />
                                            )}
                                            <div className={cx('item-info')}>
                                                <p className={cx('item-name')}>
                                                    {item.product?.name || 'Sản phẩm'}
                                                    {item.quantity > 1 && (
                                                        <span className={cx('item-qty')}> x{item.quantity}</span>
                                                    )}
                                                </p>
                                                {item.defaultSize && (
                                                    <p className={cx('item-size')}>
                                                        Cỡ: {SIZE_LABEL[item.defaultSize] || item.defaultSize}
                                                        {item.allowSizeChange && (
                                                            <span className={cx('size-change')}>
                                                                {' '}
                                                                (có thể thay đổi)
                                                            </span>
                                                        )}
                                                    </p>
                                                )}
                                                {item.includedToppings?.length > 0 && (
                                                    <p className={cx('item-toppings')}>
                                                        Kèm:{' '}
                                                        {item.includedToppings
                                                            .map((t) => t.topping?.name)
                                                            .filter(Boolean)
                                                            .join(', ')}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <FontAwesomeIcon icon={faCheckCircle} className={cx('check-icon')} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Số lượng + Thêm vào giỏ */}
                    <div className={cx('footer-block')}>
                        <div className={cx('qty-control')}>
                            <button className={cx('qty-btn')} onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
                                −
                            </button>
                            <span className={cx('qty-display')}>{quantity}</span>
                            <button className={cx('qty-btn')} onClick={() => setQuantity((q) => q + 1)}>
                                +
                            </button>
                        </div>

                        <button className={cx('btn-add-cart', { 'btn-added': added })} onClick={handleAddToCart}>
                            <FontAwesomeIcon icon={faCartShopping} />
                            <span>
                                {added ? 'Đã thêm vào giỏ!' : 'Thêm vào giỏ — ' + formatPrice(combo.price * quantity)}
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ComboDetail;
