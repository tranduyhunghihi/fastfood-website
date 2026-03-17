import classNames from 'classnames/bind';
import styles from './ChangePassword.module.scss';

const cx = classNames.bind(styles);

function ChangePassword() {
    return (
        <div className={cx('main')}>
            <div className={cx('heading')}>
                <p className={cx('heading-title')}>ĐỔI mật khẩu</p>
            </div>
            <div className={cx('form')}>
                <div className={cx('input-container')}>
                    <label>Mật khẩu hiện tại</label>
                    <input className={cx('input-box')} placeholder="Nhập mật khẩu hiện tại" />
                </div>
                <div className={cx('input-container')}>
                    <label>Mật khẩu mới</label>
                    <input className={cx('input-box')} placeholder="Bao gồm chữ cái, số và ký tự đặc biệt" />
                </div>
                <div className={cx('input-container')}>
                    <label>Nhập lại mật khẩu mới</label>
                    <input className={cx('input-box')} placeholder="Nhập lại mật khẩu mới" />
                </div>
                <div className={cx('btn-box')}>
                    <div className={cx('btn-submit')}>Lưu</div>
                </div>
            </div>
        </div>
    );
}

export default ChangePassword;
