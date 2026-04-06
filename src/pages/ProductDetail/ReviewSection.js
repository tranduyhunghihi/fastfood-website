import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './ReviewSection.module.scss';
import axiosInstance from '../../axios/axiosInstance';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);

function StarRating({ value, onChange, size = 'md' }) {
    const [hovered, setHovered] = useState(0);
    const active = hovered || value;

    return (
        <div className={cx('stars', `stars-${size}`)}>
            {[1, 2, 3, 4, 5].map((star) => (
                <span
                    key={star}
                    className={cx('star', { 'star-active': star <= active })}
                    onClick={() => onChange && onChange(star)}
                    onMouseEnter={() => onChange && setHovered(star)}
                    onMouseLeave={() => onChange && setHovered(0)}
                >
                    ★
                </span>
            ))}
        </div>
    );
}

function ReviewForm({ productId, onSuccess }) {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        if (!rating) {
            setError('Vui lòng chọn số sao.');
            return;
        }
        if (!comment.trim()) {
            setError('Vui lòng nhập bình luận.');
            return;
        }

        setLoading(true);
        setError('');
        try {
            await axiosInstance.post(`/reviews/${productId}`, { rating, comment });
            setRating(0);
            setComment('');
            onSuccess();
        } catch (err) {
            setError(err.response?.data?.message || 'Đã có lỗi xảy ra.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={cx('form')}>
            <p className={cx('form-title')}>Viết đánh giá của bạn</p>
            <div className={cx('form-rating')}>
                <span>Chọn số sao:</span>
                <StarRating value={rating} onChange={setRating} size="lg" />
                {rating > 0 && (
                    <span className={cx('rating-label')}>
                        {['', 'Rất tệ', 'Tệ', 'Bình thường', 'Tốt', 'Rất tốt'][rating]}
                    </span>
                )}
            </div>
            <textarea
                className={cx('form-textarea')}
                placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                value={comment}
                onChange={(e) => {
                    setComment(e.target.value);
                    setError('');
                }}
                maxLength={500}
                rows={3}
            />
            <div className={cx('form-footer')}>
                {error && <p className={cx('form-error')}>{error}</p>}
                <span className={cx('char-count')}>{comment.length}/500</span>
                <button
                    className={cx('btn-submit', { 'btn-loading': loading })}
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? 'Đang gửi...' : 'Gửi đánh giá'}
                </button>
            </div>
        </div>
    );
}

function ReviewItem({ review, currentUserId, onDelete }) {
    const isOwn = review.user === currentUserId || review.user?._id === currentUserId;

    return (
        <div className={cx('review-item')}>
            <div className={cx('review-header')}>
                <div className={cx('reviewer-avatar')}>{review.userName?.charAt(0).toUpperCase()}</div>
                <div className={cx('reviewer-info')}>
                    <p className={cx('reviewer-name')}>{review.userName}</p>
                    <div className={cx('reviewer-meta')}>
                        <StarRating value={review.rating} size="sm" />
                        <span className={cx('review-date')}>
                            {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                        </span>
                    </div>
                </div>
                {isOwn && (
                    <button className={cx('btn-delete')} onClick={() => onDelete(review._id)}>
                        Xóa
                    </button>
                )}
            </div>
            <p className={cx('review-comment')}>{review.comment}</p>
        </div>
    );
}

export default function ReviewSection({ productId }) {
    const { user, isLoggedIn } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [stats, setStats] = useState({ avg: 0, total: 0, distribution: [] });
    const [loading, setLoading] = useState(true);
    const [hasReviewed, setHasReviewed] = useState(false);

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get(`/reviews/${productId}`);
            setReviews(res.data.data || []);
            setStats({ avg: res.data.avg, total: res.data.total, distribution: res.data.distribution || [] });
            // Kiểm tra user đã review chưa
            if (user) {
                const mine = (res.data.data || []).find((r) => r.user === user._id || r.user?._id === user._id);
                setHasReviewed(!!mine);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [productId]);

    const handleDelete = async (reviewId) => {
        try {
            await axiosInstance.delete(`/reviews/${reviewId}`);
            fetchReviews();
        } catch (err) {
            alert(err.response?.data?.message || 'Lỗi xóa đánh giá.');
        }
    };

    return (
        <div className={cx('wrapper')}>
            <h2 className={cx('section-title')}>Đánh giá sản phẩm</h2>

            {/* Tổng quan rating */}
            {stats.total > 0 && (
                <div className={cx('stats')}>
                    <div className={cx('stats-avg')}>
                        <p className={cx('avg-number')}>{stats.avg}</p>
                        <StarRating value={Math.round(stats.avg)} size="lg" />
                        <p className={cx('avg-total')}>{stats.total} đánh giá</p>
                    </div>
                    <div className={cx('stats-bars')}>
                        {stats.distribution.map(({ star, count }) => {
                            const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                            return (
                                <div key={star} className={cx('bar-row')}>
                                    <span className={cx('bar-label')}>{star} ★</span>
                                    <div className={cx('bar-track')}>
                                        <div className={cx('bar-fill')} style={{ width: `${pct}%` }} />
                                    </div>
                                    <span className={cx('bar-count')}>{count}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Form đánh giá */}
            {!isLoggedIn ? (
                <div className={cx('login-prompt')}>
                    <Link to="/sign-in" className={cx('login-link')}>
                        Đăng nhập
                    </Link>
                    <span> để đánh giá sản phẩm này</span>
                </div>
            ) : hasReviewed ? (
                <div className={cx('reviewed-msg')}>✅ Bạn đã đánh giá sản phẩm này</div>
            ) : (
                <ReviewForm
                    productId={productId}
                    onSuccess={() => {
                        fetchReviews();
                        setHasReviewed(true);
                    }}
                />
            )}

            {/* Danh sách đánh giá */}
            <div className={cx('review-list')}>
                {loading ? (
                    Array.from({ length: 3 }).map((_, i) => <div key={i} className={cx('review-skeleton')} />)
                ) : reviews.length === 0 ? (
                    <p className={cx('empty')}>Chưa có đánh giá nào. Hãy là người đầu tiên!</p>
                ) : (
                    reviews.map((r) => (
                        <ReviewItem key={r._id} review={r} currentUserId={user?._id} onDelete={handleDelete} />
                    ))
                )}
            </div>
        </div>
    );
}
