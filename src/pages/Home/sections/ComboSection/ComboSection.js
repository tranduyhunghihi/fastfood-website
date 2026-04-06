import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './ComboSection.module.scss';
import axiosInstance from '../../../../axios/axiosInstance';
import { useCart } from '../../../../contexts/CartContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTag } from '@fortawesome/free-solid-svg-icons';
import '../../../../public/assets/css/grid.css';

const cx = classNames.bind(styles);

const formatPrice = (price) => new Intl.NumberFormat('vi-VN').format(price) + ' đ';

function ComboSection() {
    const [combos, setCombos] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addItem } = useCart();
    const navigate = useNavigate(); // ← THÊM

    useEffect(() => {
        axiosInstance
            .get('/combos')
            .then((res) => setCombos(res.data.data || []))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (!loading && combos.length === 0) return null;

    const handleAddToCart = (e, combo) => {
        e.stopPropagation(); // ← không trigger navigate
        addItem({
            itemId: combo._id,
            itemType: 'combo',
            name: combo.name,
            image: combo.image || '',
            unitPrice: combo.price,
            quantity: 1,
        });
    };

    return (
        <div className={cx('wrapper')}>
            <section id="combo" className={cx('container')}>
                <h2 className={cx('title')}>COMBO ƯU ĐÃI</h2>

                <div className="grid wide">
                    <div className="row">
                        {loading
                            ? Array.from({ length: 3 }).map((_, i) => (
                                  <div key={i} className={`${cx('item-container', 'skeleton')} col c-5-5 c-o-0-3`} />
                              ))
                            : combos.map((combo) => (
                                  <div
                                      key={combo._id}
                                      className={`${cx('item-container')} col c-5-5 c-o-0-3`}
                                      onClick={() => navigate('/combos/' + combo.slug)} // ← THÊM
                                      style={{ cursor: 'pointer' }}
                                  >
                                      <div className={cx('img-wrap')}>
                                          <img
                                              src={combo.image || '/assets/image/placeholder.webp'}
                                              alt={combo.name}
                                              className={cx('item-img')}
                                          />
                                          {combo.discountPercent > 0 && (
                                              <span className={cx('badge-discount')}>-{combo.discountPercent}%</span>
                                          )}
                                      </div>

                                      <div className={cx('item-info')}>
                                          <p className={cx('item-title')}>{combo.name}</p>

                                          {combo.items?.length > 0 && (
                                              <ul className={cx('item-list')}>
                                                  {combo.items.slice(0, 2).map((item, i) => (
                                                      <li key={i} className={cx('item-row')}>
                                                          <span className={cx('item-dot')}>•</span>
                                                          <span>
                                                              {item.product?.name || 'Sản phẩm'}
                                                              {item.quantity > 1 && ` x${item.quantity}`}
                                                              {item.defaultSize && ` (${item.defaultSize})`}
                                                          </span>
                                                      </li>
                                                  ))}
                                                  {combo.items.length > 2 && (
                                                      <li className={cx('item-row', 'item-more')}>
                                                          <span className={cx('item-dot')}>•</span>
                                                          <span>+{combo.items.length - 2} món khác...</span>
                                                      </li>
                                                  )}
                                              </ul>
                                          )}

                                          <div className={cx('item-price-box')}>
                                              <div className={cx('price-wrap')}>
                                                  {combo.originalPrice > combo.price && (
                                                      <p className={cx('price-original')}>
                                                          {formatPrice(combo.originalPrice)}
                                                      </p>
                                                  )}
                                                  <div className={cx('price-row')}>
                                                      <FontAwesomeIcon icon={faTag} className={cx('tag-icon')} />
                                                      <p className={cx('price')}>{formatPrice(combo.price)}</p>
                                                  </div>
                                                  {combo.savings > 0 && (
                                                      <p className={cx('savings')}>
                                                          Tiết kiệm {formatPrice(combo.savings)}
                                                      </p>
                                                  )}
                                              </div>

                                              <button
                                                  className={cx('btn-add')}
                                                  onClick={(e) => handleAddToCart(e, combo)} // ← THÊM e
                                                  title="Thêm vào giỏ"
                                              >
                                                  <FontAwesomeIcon icon={faPlus} />
                                              </button>
                                          </div>
                                      </div>
                                  </div>
                              ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default ComboSection;
