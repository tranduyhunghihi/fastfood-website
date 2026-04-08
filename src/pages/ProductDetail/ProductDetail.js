import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faAngleLeft,
    faPlus,
    faMinus,
    faCartShopping,
    faTag,
    faChevronLeft,
    faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import styles from './ProductDetail.module.scss';
import axiosInstance from '../../axios/axiosInstance';
import { useCart } from '../../contexts/CartContext';
import ReviewSection from './ReviewSection';

const cx = classNames.bind(styles);

const formatPrice = (price) => new Intl.NumberFormat('vi-VN').format(price) + ' đ';

const SIZE_LABEL = { small: 'Nhỏ', medium: 'Vừa', large: 'Lớn', family: 'Gia đình' };
const CRUST_LABEL = { traditional: 'Truyền thống', thin: 'Mỏng giòn', cheesy: 'Phô mai viền', stuffed: 'Nhân phô mai' };

function ImageGallery({ images }) {
    const [current, setCurrent] = useState(0);
    const list = images && images.length > 0 ? images : ['/assets/image/placeholder.webp'];

    const prev = () => setCurrent((c) => (c - 1 + list.length) % list.length);
    const next = () => setCurrent((c) => (c + 1) % list.length);

    return (
        <div className={cx('gallery')}>
            <div className={cx('gallery-main')}>
                <img src={list[current]} alt="product" className={cx('gallery-img')} />
                {list.length > 1 && (
                    <>
                        <button className={cx('gallery-btn', 'gallery-btn-left')} onClick={prev}>
                            <FontAwesomeIcon icon={faChevronLeft} />
                        </button>
                        <button className={cx('gallery-btn', 'gallery-btn-right')} onClick={next}>
                            <FontAwesomeIcon icon={faChevronRight} />
                        </button>
                    </>
                )}
            </div>
            {list.length > 1 && (
                <div className={cx('gallery-thumbs')}>
                    {list.map((img, i) => (
                        <img
                            key={i}
                            src={img}
                            alt={'thumb-' + i}
                            className={cx('gallery-thumb', { 'thumb-active': i === current })}
                            onClick={() => setCurrent(i)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

function ProductDetail() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { addItem } = useCart();

    const [product, setProduct] = useState(null);
    const [related, setRelated] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedCrust, setSelectedCrust] = useState(null);
    const [selectedToppings, setSelectedToppings] = useState({});
    const [quantity, setQuantity] = useState(1);

    const [unitPrice, setUnitPrice] = useState(0);
    const [calculating, setCalculating] = useState(false);

    useEffect(() => {
        setLoading(true);
        setError('');
        axiosInstance
            .get('/products/' + slug)
            .then((res) => {
                const p = res.data.data;
                setProduct(p);
                setRelated(res.data.related || []);
                const defaultSize = p.sizes && p.sizes[0] ? p.sizes[0].size : null;
                const defaultCrust = p.crusts && p.crusts[0] ? p.crusts[0].type : null;
                setSelectedSize(defaultSize);
                setSelectedCrust(defaultCrust);
                setSelectedToppings({});
                setQuantity(1);
                const defaultPrice = p.isPromotion && p.promotionPrice ? p.promotionPrice : p.basePrice;
                const sizePrice = p.sizes && p.sizes[0] ? p.sizes[0].price : defaultPrice;
                setUnitPrice(sizePrice || defaultPrice);
            })
            .catch(() => setError('Không tìm thấy sản phẩm.'))
            .finally(() => setLoading(false));
    }, [slug]);

    useEffect(() => {
        if (!product) return;

        const toppingList = Object.entries(selectedToppings)
            .filter(function (entry) {
                return entry[1] > 0;
            })
            .map(function (entry) {
                return { toppingId: entry[0], quantity: entry[1] };
            });

        setCalculating(true);
        axiosInstance
            .post('/products/calculate-price', {
                productId: product._id,
                size: selectedSize,
                crust: selectedCrust,
                toppings: toppingList,
            })
            .then((res) => setUnitPrice(res.data.data.totalPrice))
            .catch(() => {
                const base = product.isPromotion && product.promotionPrice ? product.promotionPrice : product.basePrice;
                const sizeOption = product.sizes ? product.sizes.find((s) => s.size === selectedSize) : null;
                setUnitPrice(sizeOption && sizeOption.price ? sizeOption.price : base);
            })
            .finally(() => setCalculating(false));
    }, [product, selectedSize, selectedCrust, selectedToppings]);

    const handleToppingChange = (toppingId, delta) => {
        setSelectedToppings((prev) => {
            const current = prev[toppingId] || 0;
            const next = Math.max(0, current + delta);
            if (next === 0) {
                const updated = Object.assign({}, prev);
                delete updated[toppingId];
                return updated;
            }
            return Object.assign({}, prev, { [toppingId]: next });
        });
    };

    const handleAddToCart = () => {
        const toppingDetails = Object.entries(selectedToppings)
            .filter(function (entry) {
                return entry[1] > 0;
            })
            .map(function (entry) {
                const toppingId = entry[0];
                const qty = entry[1];
                const config = product.availableToppings
                    ? product.availableToppings.find(
                          (at) => at.topping._id === toppingId || String(at.topping._id) === toppingId,
                      )
                    : null;
                return {
                    topping: toppingId,
                    name: config ? config.topping.name : '',
                    price: config ? config.additionalPrice : 0,
                    quantity: qty,
                };
            });

        addItem({
            itemId: product._id,
            itemType: 'product',
            name: product.name,
            image: product.images && product.images[0] ? product.images[0] : '',
            size: selectedSize,
            crust: selectedCrust,
            toppings: toppingDetails,
            unitPrice: unitPrice,
            quantity: quantity,
        });

        navigate('/cart');
    };

    if (loading) {
        return (
            <div className={cx('wrapper')}>
                <div className={cx('skeleton-wrap')}>
                    <div className={cx('skeleton-img')} />
                    <div className={cx('skeleton-info')}>
                        <div className={cx('skeleton-line')} style={{ width: '75%' }} />
                        <div className={cx('skeleton-line')} style={{ width: '65%' }} />
                        <div className={cx('skeleton-line')} style={{ width: '55%' }} />
                        <div className={cx('skeleton-line')} style={{ width: '45%' }} />
                    </div>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className={cx('wrapper', 'error-wrap')}>
                <p className={cx('error-msg')}>{error || 'Sản phẩm không tồn tại.'}</p>
                <button className={cx('btn-back-home')} onClick={() => navigate('/')}>
                    Về trang chủ
                </button>
            </div>
        );
    }

    const baseDisplayPrice = product.isPromotion && product.promotionPrice ? product.promotionPrice : product.basePrice;

    return (
        <div className={cx('wrapper')}>
            <div className={cx('back-bar')}>
                <span className={cx('back-btn')} onClick={() => navigate(-1)}>
                    <FontAwesomeIcon icon={faAngleLeft} />
                    Quay lại
                </span>
                <span className={cx('breadcrumb')}>
                    <Link to="/">Trang chủ</Link>
                    <span className={cx('sep')}>/</span>
                    <span>{product.category ? product.category.name : ''}</span>
                    <span className={cx('sep')}>/</span>
                    <span className={cx('breadcrumb-current')}>{product.name}</span>
                </span>
            </div>

            <div className={cx('main')}>
                <div className={cx('col-left')}>
                    <ImageGallery images={product.images} />
                </div>

                <div className={cx('col-right')}>
                    <div className={cx('info-header')}>
                        {product.isPromotion && <span className={cx('badge-promo')}>Khuyến mãi</span>}
                        <h1 className={cx('product-name')}>{product.name}</h1>
                        {product.description && <p className={cx('description')}>{product.description}</p>}
                        <div className={cx('price-block')}>
                            {product.isPromotion && product.promotionPrice ? (
                                <>
                                    <p className={cx('price-original')}>{formatPrice(product.basePrice)}</p>
                                    <p className={cx('price-current')}>{formatPrice(baseDisplayPrice)}</p>
                                </>
                            ) : (
                                <p className={cx('price-current')}>{formatPrice(baseDisplayPrice)}</p>
                            )}
                            <span className={cx('price-note')}>Giá chưa gồm tuỳ chọn</span>
                        </div>
                    </div>

                    {product.sizes && product.sizes.length > 0 && (
                        <div className={cx('option-block')}>
                            <p className={cx('option-title')}>Kích cỡ</p>
                            <div className={cx('option-list')}>
                                {product.sizes.map((s) => (
                                    <button
                                        key={s.size}
                                        className={cx('option-btn', { 'option-active': selectedSize === s.size })}
                                        onClick={() => setSelectedSize(s.size)}
                                    >
                                        <span>{SIZE_LABEL[s.size] || s.size}</span>
                                        {s.price && <span className={cx('option-price')}>{formatPrice(s.price)}</span>}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {product.crusts && product.crusts.length > 0 && (
                        <div className={cx('option-block')}>
                            <p className={cx('option-title')}>Loại đế</p>
                            <div className={cx('option-list')}>
                                {product.crusts.map((c) => (
                                    <button
                                        key={c.type}
                                        className={cx('option-btn', { 'option-active': selectedCrust === c.type })}
                                        onClick={() => setSelectedCrust(c.type)}
                                    >
                                        <span>{c.name || CRUST_LABEL[c.type] || c.type}</span>
                                        {c.additionalPrice > 0 && (
                                            <span className={cx('option-price')}>
                                                +{formatPrice(c.additionalPrice)}
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {product.availableToppings && product.availableToppings.length > 0 && (
                        <div className={cx('option-block')}>
                            <p className={cx('option-title')}>Topping thêm</p>
                            <div className={cx('topping-list')}>
                                {product.availableToppings.map(({ topping, additionalPrice }) => {
                                    const qty = selectedToppings[topping._id] || 0;
                                    return (
                                        <div key={topping._id} className={cx('topping-row')}>
                                            <span className={cx('topping-name')}>{topping.name}</span>
                                            {additionalPrice > 0 && (
                                                <span className={cx('topping-price')}>
                                                    <FontAwesomeIcon icon={faTag} />+{formatPrice(additionalPrice)}
                                                </span>
                                            )}
                                            <div className={cx('topping-qty')}>
                                                <button
                                                    className={cx('qty-btn')}
                                                    onClick={() => handleToppingChange(topping._id, -1)}
                                                    disabled={qty === 0}
                                                >
                                                    <FontAwesomeIcon icon={faMinus} />
                                                </button>
                                                <span className={cx('qty-val')}>{qty}</span>
                                                <button
                                                    className={cx('qty-btn')}
                                                    onClick={() => handleToppingChange(topping._id, 1)}
                                                >
                                                    <FontAwesomeIcon icon={faPlus} />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    <div className={cx('footer-block')}>
                        <div className={cx('qty-control')}>
                            <button className={cx('qty-btn-lg')} onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
                                <FontAwesomeIcon icon={faMinus} />
                            </button>
                            <span className={cx('qty-display')}>{quantity}</span>
                            <button className={cx('qty-btn-lg')} onClick={() => setQuantity((q) => q + 1)}>
                                <FontAwesomeIcon icon={faPlus} />
                            </button>
                        </div>

                        <button className={cx('btn-add-cart')} onClick={handleAddToCart}>
                            <FontAwesomeIcon icon={faCartShopping} />
                            <span>
                                {calculating ? 'Đang tính...' : 'Thêm vào giỏ — ' + formatPrice(unitPrice * quantity)}
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            {related.length > 0 && (
                <div className={cx('related')}>
                    <h2 className={cx('related-title')}>Có thể bạn thích</h2>
                    <div className={cx('related-list')}>
                        {related.map((p) => (
                            <Link key={p._id} to={'/products/' + p.slug} className={cx('related-item')}>
                                <img
                                    src={p.images && p.images[0] ? p.images[0] : '/assets/image/placeholder.webp'}
                                    alt={p.name}
                                    className={cx('related-img')}
                                />
                                <p className={cx('related-name')}>{p.name}</p>
                                <p className={cx('related-price')}>
                                    {p.isPromotion && p.promotionPrice
                                        ? formatPrice(p.promotionPrice)
                                        : formatPrice(p.basePrice)}
                                </p>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
            <ReviewSection productId={product._id} />
        </div>
    );
}

export default ProductDetail;
