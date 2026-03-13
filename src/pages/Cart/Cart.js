import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import styles from './Cart.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faArrowLeft, faCartShopping } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function Cart() {
    return (
        <div className={cx('wrapper')}>
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
                <div className={cx('main')}>
                    <FontAwesomeIcon icon={faCartShopping} className={cx('cart-icon')} />
                    <p>Giỏ hàng của bạn trống</p>
                    <p>Giỏ hàng của bạn trông hơi trống. Tại sao không thử một vài món trong</p>
                    <Link to="/" className={cx('back-home')}>
                        món ăn của chúng tôi?
                    </Link>
                </div>
                <div className={cx('check-out')}>
                    <div className={cx('voucher-box')}>
                        <div className={cx('voucher-container')}>
                            <div className={cx('voucher-header')}>
                                <div className={cx('voucher-title')}>Voucher</div>
                                <FontAwesomeIcon icon={faAngleRight} className={cx('icon-right')} />
                            </div>
                            <div className={cx('voucher-content')}>
                                <p>Nhập hoặc chọn voucher của bạn</p>
                            </div>
                        </div>
                    </div>
                    <div className={cx('plastic-box')}>
                        <div className={cx('plastic-title')}>Muỗng Nĩa Nhựa</div>
                        <div className={cx('plastic-icon')}>
                            <p>Không</p>
                            <FontAwesomeIcon icon={faAngleRight} className={cx('icon-right')} />
                        </div>
                    </div>
                    <div className={cx('total-box')}>
                        <div className={cx('total-info')}>
                            <div className={cx('info-item')}>
                                <p>Tạm tính</p>
                                <p>0 đ</p>
                            </div>
                            <div className={cx('info-item')}>
                                <p>Giảm giá thành viên</p>
                                <p>0 đ</p>
                            </div>
                            <div className={cx('info-item')}>
                                <p>Phí giao hàng</p>
                                <p>0 đ</p>
                            </div>
                        </div>
                        <div className={cx('total-final')}>
                            <p>Tổng cộng</p>
                            <p className={cx('total-count')}>0 đ</p>
                        </div>
                    </div>
                    <div className={cx('pay')}>Thanh Toán</div>
                </div>
            </div>
        </div>
    );
}

export default Cart;
