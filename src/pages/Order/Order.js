import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import styles from './Order.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faArrowLeft, faCartShopping } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function Order() {
    return (
        <div className={cx('wrapper')}>
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
                    <div className={cx('heading')}>Chỉ áp dụng cho đơn hàng đang giao</div>
                    <div className={cx('container')}>
                        <input className={cx('input-box')} placeholder="Nhập số điện thoại hoặc mã đơn hàng" />
                        <div className={cx('btn-search')}>Tìm kiếm</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Order;
