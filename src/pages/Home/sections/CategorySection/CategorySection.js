import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import styles from './CategorySection.module.scss';
import axiosInstance from '../../../../axios/axiosInstance';
import { useCart } from '../../../../contexts/CartContext';
import '../../../../public/assets/css/grid.css';

const cx = classNames.bind(styles);

const formatPrice = (price) => new Intl.NumberFormat('vi-VN').format(price) + ' đ';

function CategorySection({ category }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addItem } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        axiosInstance
            .get(`/products?category=${category.slug}&limit=12`)
            .then((res) => setProducts(res.data.data || []))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [category.slug]);

    if (!loading && products.length === 0) return null;

    const handleAddToCart = (product) => {
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
            <section id={category.slug} className={cx('container')}>
                <h2 className={cx('title')}>{category.name.toUpperCase()}</h2>

                {category.image && (
                    <div className={cx('banner')} style={{ backgroundImage: `url(${category.image})` }} />
                )}

                <div className="grid wide">
                    <div className="row">
                        {loading
                            ? Array.from({ length: 4 }).map((_, i) => (
                                  <div key={i} className={`${cx('item-container', 'skeleton')} col c-5-5 c-o-0-2`} />
                              ))
                            : products.map((product) => {
                                  const outOfStock = product.stock === 0;
                                  return (
                                      <div
                                          key={product._id}
                                          className={`${cx('item-container')} col c-5-5 c-o-0-2`}
                                          onClick={() => !outOfStock && navigate(`/products/${product.slug}`)}
                                          style={{ cursor: outOfStock ? 'default' : 'pointer' }}
                                      >
                                          <div style={{ position: 'relative' }}>
                                              <img
                                                  src={product.images?.[0] || '/assets/image/placeholder.webp'}
                                                  alt={product.name}
                                                  className={cx('item-img')}
                                                  style={{ opacity: outOfStock ? 0.5 : 1 }}
                                              />
                                              {outOfStock && (
                                                  <div
                                                      style={{
                                                          position: 'absolute',
                                                          inset: 0,
                                                          display: 'flex',
                                                          alignItems: 'center',
                                                          justifyContent: 'center',
                                                          background: 'rgba(0,0,0,0.35)',
                                                          borderRadius: 8,
                                                          left: '-12px',
                                                      }}
                                                  >
                                                      <span
                                                          style={{
                                                              background: '#c8102e',
                                                              color: '#fff',
                                                              padding: '4px 12px',
                                                              borderRadius: 99,
                                                              fontSize: '1.3rem',
                                                              fontWeight: 700,
                                                          }}
                                                      >
                                                          Hết hàng
                                                      </span>
                                                  </div>
                                              )}
                                          </div>
                                          <div className={cx('item-info')}>
                                              <div className={cx('item-heading')}>
                                                  <p className={cx('item-title')}>{product.name}</p>
                                                  {product.description && (
                                                      <p className={cx('description')}>{product.description}</p>
                                                  )}
                                              </div>
                                              <div className={cx('item-price-box')}>
                                                  <div className={cx('item-price')}>
                                                      {outOfStock ? (
                                                          <p style={{ color: '#aaa', fontSize: '1.3rem' }}>
                                                              Tạm hết hàng
                                                          </p>
                                                      ) : product.isPromotion && product.promotionPrice ? (
                                                          <>
                                                              <p>Khuyến mãi</p>
                                                              <p className={cx('price')}>
                                                                  {formatPrice(product.promotionPrice)}
                                                              </p>
                                                          </>
                                                      ) : (
                                                          <>
                                                              <p>Chỉ từ</p>
                                                              <p className={cx('price')}>
                                                                  {formatPrice(product.basePrice)}
                                                              </p>
                                                          </>
                                                      )}
                                                  </div>
                                                  <div
                                                      className={cx('btn-add')}
                                                      onClick={(e) => {
                                                          e.stopPropagation();
                                                          if (!outOfStock) handleAddToCart(product);
                                                      }}
                                                      style={{
                                                          opacity: outOfStock ? 0.4 : 1,
                                                          cursor: outOfStock ? 'not-allowed' : 'pointer',
                                                      }}
                                                  >
                                                      <FontAwesomeIcon icon={faPlus} />
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                  );
                              })}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default CategorySection;
