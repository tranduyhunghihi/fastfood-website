import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMagnifyingGlass, faXmark } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import styles from './SearchResults.module.scss';
import axiosInstance from '../../../../axios/axiosInstance';
import { useCart } from '../../../../contexts/CartContext';

const cx = classNames.bind(styles);
const formatPrice = (price) => new Intl.NumberFormat('vi-VN').format(price) + ' đ';

function SearchResults({ keyword, onClose }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const { addItem } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        if (!keyword.trim()) return;
        setLoading(true);
        axiosInstance
            .get('/products', { params: { search: keyword, limit: 20 } })
            .then((res) => setProducts(res.data.data || []))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [keyword]);

    const handleAddToCart = (e, product) => {
        e.stopPropagation();
        addItem({
            itemId: product._id,
            itemType: 'product',
            name: product.name,
            image: product.images?.[0] || '',
            size: product.sizes?.[0]?.size || null,
            unitPrice: product.isPromotion && product.promotionPrice ? product.promotionPrice : product.basePrice,
            quantity: 1,
        });
    };

    return (
        <div className={cx('wrapper')}>
            {/* Header */}
            <div className={cx('header')}>
                <div className={cx('header-left')}>
                    <FontAwesomeIcon icon={faMagnifyingGlass} className={cx('search-icon')} />
                    <span>
                        Kết quả tìm kiếm cho: <strong>"{keyword}"</strong>
                    </span>
                </div>
                <button className={cx('close-btn')} onClick={onClose}>
                    <FontAwesomeIcon icon={faXmark} />
                    Đóng kết quả
                </button>
            </div>

            {/* Results */}
            {loading ? (
                <div className={cx('grid')}>
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className={cx('card', 'skeleton')} />
                    ))}
                </div>
            ) : products.length === 0 ? (
                <div className={cx('empty')}>
                    <FontAwesomeIcon icon={faMagnifyingGlass} className={cx('empty-icon')} />
                    <p>
                        Không tìm thấy sản phẩm nào cho "<strong>{keyword}</strong>"
                    </p>
                    <span>Thử tìm với từ khoá khác nhé!</span>
                </div>
            ) : (
                <>
                    <p className={cx('result-count')}>
                        Tìm thấy <strong>{products.length}</strong> sản phẩm
                    </p>
                    <div className={cx('grid')}>
                        {products.map((product) => (
                            <div
                                key={product._id}
                                className={cx('card')}
                                onClick={() => navigate(`/products/${product.slug}`)}
                            >
                                <div className={cx('img-wrap')}>
                                    <img
                                        src={product.images?.[0] || '/assets/image/placeholder.webp'}
                                        alt={product.name}
                                        className={cx('img')}
                                    />
                                    {product.isPromotion && <span className={cx('badge-promo')}>KM</span>}
                                </div>
                                <div className={cx('info')}>
                                    <p className={cx('name')}>{product.name}</p>
                                    {product.description && <p className={cx('desc')}>{product.description}</p>}
                                    <div className={cx('price-row')}>
                                        <div className={cx('price-wrap')}>
                                            {product.isPromotion && product.promotionPrice ? (
                                                <>
                                                    <p className={cx('price-original')}>
                                                        {formatPrice(product.basePrice)}
                                                    </p>
                                                    <p className={cx('price')}>{formatPrice(product.promotionPrice)}</p>
                                                </>
                                            ) : (
                                                <p className={cx('price')}>{formatPrice(product.basePrice)}</p>
                                            )}
                                        </div>
                                        <button className={cx('btn-add')} onClick={(e) => handleAddToCart(e, product)}>
                                            <FontAwesomeIcon icon={faPlus} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

export default SearchResults;
