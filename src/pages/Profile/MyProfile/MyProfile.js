import { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './MyProfile.module.scss';
import { useAuth } from '../../../contexts/AuthContext';
import axiosInstance from '../../../axios/axiosInstance';

const cx = classNames.bind(styles);

const GENDER_OPTIONS = [
    { value: '', label: 'Chưa cập nhật' },
    { value: 'male', label: 'Nam' },
    { value: 'female', label: 'Nữ' },
    { value: 'other', label: 'Khác' },
];

function MyProfile() {
    const { user, updateUser } = useAuth();
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        gender: user?.gender || '',
        dateOfBirth: user?.dateOfBirth ? user.dateOfBirth.slice(0, 10) : '',
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setSuccess('');
        setError('');
    };

    const handleCancel = () => {
        setForm({
            name: user?.name || '',
            phone: user?.phone || '',
            gender: user?.gender || '',
            dateOfBirth: user?.dateOfBirth ? user.dateOfBirth.slice(0, 10) : '',
        });
        setEditing(false);
        setError('');
        setSuccess('');
    };

    const handleSubmit = async () => {
        if (!form.name.trim()) {
            setError('Tên không được để trống.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const res = await axiosInstance.put('/users/me', form);
            updateUser(res.data.data);
            setSuccess('Cập nhật thành công!');
            setEditing(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Đã có lỗi xảy ra.');
        } finally {
            setLoading(false);
        }
    };
    console.log(form);

    return (
        <div className={cx('main')}>
            <div className={cx('heading')}>
                <p className={cx('heading-title')}>Hồ Sơ Của Tôi</p>
                {!editing ? (
                    <div className={cx('edit-btn')} onClick={() => setEditing(true)}>
                        Chỉnh sửa
                    </div>
                ) : (
                    <div className={cx('edit-btn', 'cancel-btn')} onClick={handleCancel}>
                        Huỷ
                    </div>
                )}
            </div>

            {success && <p className={cx('msg-success')}>{success}</p>}
            {error && <p className={cx('msg-error')}>{error}</p>}

            <div className={cx('form')}>
                {/* Tên */}
                <div className={cx('input-container')}>
                    <label>Tên</label>
                    <input
                        className={cx('input-box')}
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        disabled={!editing}
                        placeholder="Nhập tên"
                    />
                </div>

                {/* Email — không cho sửa */}
                <div className={cx('input-container')}>
                    <label>Email</label>
                    <input className={cx('input-box', 'input-disabled')} value={user?.email || ''} disabled />
                </div>

                {/* Số điện thoại */}
                <div className={cx('input-container')}>
                    <label>Số điện thoại</label>
                    <input
                        className={cx('input-box')}
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        disabled={!editing}
                        placeholder="Chưa cập nhật"
                    />
                </div>

                {/* Giới tính */}
                <div className={cx('input-container')}>
                    <label>Giới tính</label>
                    {editing ? (
                        <div className={cx('gender-group')}>
                            {GENDER_OPTIONS.filter((g) => g.value !== '').map((opt) => (
                                <label key={opt.value} className={cx('gender-label')}>
                                    <input
                                        type="radio"
                                        name="gender"
                                        value={opt.value}
                                        checked={form.gender === opt.value}
                                        onChange={handleChange}
                                    />
                                    {opt.label}
                                </label>
                            ))}
                        </div>
                    ) : (
                        <input
                            className={cx('input-box', 'input-disabled')}
                            value={
                                GENDER_OPTIONS.find((g) => g.value === (user?.gender || ''))?.label || 'Chưa cập nhật'
                            }
                            disabled
                        />
                    )}
                </div>

                {/* Ngày sinh */}
                <div className={cx('input-container')}>
                    <label>Ngày sinh</label>
                    <input
                        className={cx('input-box', { 'input-disabled': !editing })}
                        name="dateOfBirth"
                        type="date"
                        value={form.dateOfBirth}
                        onChange={handleChange}
                        disabled={!editing}
                        max={new Date().toISOString().slice(0, 10)}
                    />
                </div>

                {editing && (
                    <div className={cx('btn-box')}>
                        <button
                            className={cx('btn-submit', { 'btn-loading': loading })}
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MyProfile;
