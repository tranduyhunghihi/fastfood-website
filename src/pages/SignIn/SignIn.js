import { useState, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './SignIn.module.scss';
import { useAuth } from '../../contexts/AuthContext';

const cx = classNames.bind(styles);

// Bước nhập OTP
function OtpStep({ email, pendingData, onSuccess, onBack }) {
    const { verifyOtp, sendOtp } = useAuth();
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const inputRefs = useRef([]);

    const handleChange = (i, val) => {
        if (!/^\d?$/.test(val)) return; // chỉ nhận số
        const next = [...otp];
        next[i] = val;
        setOtp(next);
        setError('');
        // tự động focus ô tiếp theo
        if (val && i < 5) inputRefs.current[i + 1]?.focus();
    };

    const handleKeyDown = (i, e) => {
        if (e.key === 'Backspace' && !otp[i] && i > 0) {
            inputRefs.current[i - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (text.length === 6) {
            setOtp(text.split(''));
            inputRefs.current[5]?.focus();
        }
    };

    const handleSubmit = async () => {
        const code = otp.join('');
        if (code.length < 6) {
            setError('Vui lòng nhập đủ 6 chữ số.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            await verifyOtp(email, code);
            onSuccess();
        } catch (err) {
            setError(err.response?.data?.message || 'Mã OTP không chính xác.');
            setOtp(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setResending(true);
        setError('');
        try {
            await sendOtp(pendingData.name, pendingData.email, pendingData.password);
            setOtp(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể gửi lại OTP.');
        } finally {
            setResending(false);
        }
    };

    return (
        <div className={cx('container')}>
            <div className={cx('otp-icon')}>📧</div>
            <h2 className={cx('title')}>Xác nhận email</h2>
            <p className={cx('otp-desc')}>
                Mã OTP đã được gửi đến
                <br />
                <strong>{email}</strong>
            </p>

            <div className={cx('otp-boxes')} onPaste={handlePaste}>
                {otp.map((digit, i) => (
                    <input
                        key={i}
                        ref={(el) => (inputRefs.current[i] = el)}
                        className={cx('otp-box', { 'otp-filled': !!digit })}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChange(i, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(i, e)}
                        autoFocus={i === 0}
                    />
                ))}
            </div>

            {error && <p className={cx('error')}>{error}</p>}

            <button className={cx('btn-submit', { loading })} onClick={handleSubmit} disabled={loading}>
                {loading ? 'Đang xác nhận...' : 'Xác nhận'}
            </button>

            <div className={cx('otp-footer')}>
                <span>Không nhận được mã? </span>
                <button className={cx('btn-resend')} onClick={handleResend} disabled={resending}>
                    {resending ? 'Đang gửi...' : 'Gửi lại'}
                </button>
            </div>

            <button className={cx('btn-back-otp')} onClick={onBack}>
                ← Quay lại
            </button>
        </div>
    );
}

// Main SignIn
function SignIn() {
    const { login, sendOtp } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [mode, setMode] = useState('login');
    // step: 'form' | 'otp'
    const [step, setStep] = useState('form');
    const [pendingEmail, setPendingEmail] = useState('');
    const [pendingData, setPendingData] = useState(null);

    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const from = location.state?.from?.pathname || '/';

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async () => {
        setError('');
        setLoading(true);
        try {
            if (mode === 'login') {
                await login(form.email, form.password);
                navigate(from, { replace: true });
            } else {
                if (!form.name.trim()) {
                    setError('Vui lòng nhập tên.');
                    setLoading(false);
                    return;
                }
                // Gửi OTP
                await sendOtp(form.name, form.email, form.password);
                setPendingEmail(form.email);
                setPendingData({ name: form.name, email: form.email, password: form.password });
                setStep('otp');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Đã có lỗi xảy ra, vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    // Sau khi xác nhận OTP thành công
    const handleOtpSuccess = () => navigate(from, { replace: true });

    // Quay lại form đăng ký
    const handleBack = () => {
        setStep('form');
        setError('');
    };

    // Hiện bước OTP
    if (step === 'otp') {
        return (
            <div className={cx('wrapper')}>
                <OtpStep
                    email={pendingEmail}
                    pendingData={pendingData}
                    onSuccess={handleOtpSuccess}
                    onBack={handleBack}
                />
            </div>
        );
    }

    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <h2 className={cx('title')}>{mode === 'login' ? 'Đăng Nhập' : 'Đăng Ký'}</h2>

                <div className={cx('tab-box')}>
                    <button
                        type="button"
                        className={cx('tab', { active: mode === 'login' })}
                        onClick={() => {
                            setMode('login');
                            setError('');
                        }}
                    >
                        Đăng nhập
                    </button>
                    <button
                        type="button"
                        className={cx('tab', { active: mode === 'register' })}
                        onClick={() => {
                            setMode('register');
                            setError('');
                        }}
                    >
                        Đăng ký
                    </button>
                </div>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit();
                    }}
                    noValidate
                >
                    {mode === 'register' && (
                        <div className={cx('input-container')}>
                            <label>Họ và tên</label>
                            <input
                                className={cx('input-box')}
                                name="name"
                                placeholder="Nhập họ và tên"
                                value={form.name}
                                onChange={handleChange}
                            />
                        </div>
                    )}
                    <div className={cx('input-container')}>
                        <label>Email</label>
                        <input
                            className={cx('input-box')}
                            name="email"
                            type="email"
                            placeholder="Nhập email"
                            value={form.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div className={cx('input-container')}>
                        <label>Mật khẩu</label>
                        <input
                            className={cx('input-box')}
                            name="password"
                            type="password"
                            placeholder="Nhập mật khẩu"
                            value={form.password}
                            onChange={handleChange}
                        />
                    </div>

                    {error && <p className={cx('error')}>{error}</p>}

                    <button type="submit" className={cx('btn-submit', { loading })} disabled={loading}>
                        {loading
                            ? mode === 'login'
                                ? 'Đang đăng nhập...'
                                : 'Đang gửi OTP...'
                            : mode === 'login'
                            ? 'Đăng Nhập'
                            : 'Tiếp theo'}
                    </button>
                </form>

                <Link to="/" className={cx('btn-back')}>
                    Tiếp tục không đăng nhập
                </Link>
            </div>
        </div>
    );
}

export default SignIn;
