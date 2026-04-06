import { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './ChangePassword.module.scss';
import axiosInstance from '../../../axios/axiosInstance';

const cx = classNames.bind(styles);

function ChangePassword() {
    const [form, setForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError('');
        setSuccess('');
    };

    const handleSubmit = async () => {
        if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
            setError('Vui lòng điền đầy đủ thông tin.');
            return;
        }
        if (form.newPassword !== form.confirmPassword) {
            setError('Mật khẩu mới không khớp.');
            return;
        }
        if (form.newPassword.length < 6) {
            setError('Mật khẩu mới phải có ít nhất 6 ký tự.');
            return;
        }

        setLoading(true);
        try {
            await axiosInstance.put('/auth/change-password', {
                currentPassword: form.currentPassword,
                newPassword: form.newPassword,
            });
            setSuccess('Đổi mật khẩu thành công!');
            setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            setError(err.response?.data?.message || 'Đã có lỗi xảy ra.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={cx('main')}>
            <div className={cx('heading')}>
                <p className={cx('heading-title')}>Đổi Mật Khẩu</p>
            </div>
            <div className={cx('form')}>
                <div className={cx('input-container')}>
                    <label>Mật khẩu hiện tại</label>
                    <input
                        className={cx('input-box')}
                        name="currentPassword"
                        type="password"
                        placeholder="Nhập mật khẩu hiện tại"
                        value={form.currentPassword}
                        onChange={handleChange}
                    />
                </div>
                <div className={cx('input-container')}>
                    <label>Mật khẩu mới</label>
                    <input
                        className={cx('input-box')}
                        name="newPassword"
                        type="password"
                        placeholder="Ít nhất 6 ký tự"
                        value={form.newPassword}
                        onChange={handleChange}
                    />
                </div>
                <div className={cx('input-container')}>
                    <label>Nhập lại mật khẩu mới</label>
                    <input
                        className={cx('input-box')}
                        name="confirmPassword"
                        type="password"
                        placeholder="Nhập lại mật khẩu mới"
                        value={form.confirmPassword}
                        onChange={handleChange}
                    />
                </div>

                {error && <p className={cx('error')}>{error}</p>}
                {success && <p className={cx('success')}>{success}</p>}

                <div className={cx('btn-box')}>
                    <button className={cx('btn-submit', { loading })} onClick={handleSubmit} disabled={loading}>
                        {loading ? 'Đang lưu...' : 'Lưu'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ChangePassword;
