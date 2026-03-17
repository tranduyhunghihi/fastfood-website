import classNames from 'classnames/bind';
import styles from './MyProfile.module.scss';

const cx = classNames.bind(styles);

function MyProfile() {
    return (
        <div className={cx('main')}>
            <div className={cx('heading')}>
                <p className={cx('heading-title')}>Hồ Sơ Của Tôi</p>
                <div className={cx('edit-btn')}>Chỉnh sửa</div>
            </div>
            <div className={cx('form')}>
                <div className={cx('input-container')}>
                    <label>Tên</label>
                    <input className={cx('input-box')} />
                </div>
                <div className={cx('input-container')}>
                    <label>Ngày Sinh</label>
                    <input className={cx('input-box')} />
                </div>
                <div className={cx('input-container')}>
                    <label>Giới Tính</label>
                    <input className={cx('input-box')} />
                </div>
                <div className={cx('input-container')}>
                    <label>Số Điện Thoại</label>
                    <input className={cx('input-box')} />
                </div>
                <div className={cx('input-container')}>
                    <label>Email</label>
                    <input className={cx('input-box')} />
                </div>
            </div>
        </div>
    );
}

export default MyProfile;
