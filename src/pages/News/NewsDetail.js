import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './NewsDetail.module.scss';
import axiosInstance from '../../axios/axiosInstance';
import { useAuth } from '../../contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faHeart as faHeartSolid, faClock, faUser } from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-regular-svg-icons';

const cx = classNames.bind(styles);
const fmtDate = (d) => new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });

export default function NewsDetail() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();

    const [news, setNews] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [liking, setLiking] = useState(false);

    useEffect(() => {
        setLoading(true);
        axiosInstance
            .get(`/news/${slug}`)
            .then((res) => {
                setNews(res.data.data);
                setIsLiked(res.data.isLiked);
                setLikeCount(res.data.data.likeCount || 0);
            })
            .catch(() => navigate('/news'))
            .finally(() => setLoading(false));
    }, [slug]);

    const handleLike = async () => {
        if (!isLoggedIn) {
            navigate('/sign-in');
            return;
        }
        if (liking) return;
        setLiking(true);
        try {
            const res = await axiosInstance.post(`/news/${news._id}/like`);
            setIsLiked(res.data.liked);
            setLikeCount(res.data.likeCount);
        } catch (err) {
            console.error(err);
        } finally {
            setLiking(false);
        }
    };

    if (loading) {
        return (
            <div className={cx('wrapper')}>
                <div className={cx('skeleton-title')} />
                <div className={cx('skeleton-img')} />
                <div className={cx('skeleton-body')} />
            </div>
        );
    }

    if (!news) return null;

    return (
        <div className={cx('wrapper')}>
            <div className={cx('back-bar')}>
                <span className={cx('back-btn')} onClick={() => navigate(-1)}>
                    <FontAwesomeIcon icon={faArrowLeft} /> Quay lại
                </span>
                <Link to="/news" className={cx('news-link')}>
                    Tất cả tin tức
                </Link>
            </div>

            <article className={cx('article')}>
                {/* Tags */}
                {news.tags?.length > 0 && (
                    <div className={cx('tags')}>
                        {news.tags.map((t) => (
                            <span key={t} className={cx('tag')}>
                                {t}
                            </span>
                        ))}
                    </div>
                )}

                {/* Title */}
                <h1 className={cx('title')}>{news.title}</h1>

                {/* Meta */}
                <div className={cx('meta')}>
                    <span>
                        <FontAwesomeIcon icon={faUser} /> {news.author}
                    </span>
                    <span>
                        <FontAwesomeIcon icon={faClock} /> {fmtDate(news.createdAt)}
                    </span>
                </div>

                {/* Image */}
                {news.image && <img src={news.image} alt={news.title} className={cx('hero-img')} />}

                {/* Summary */}
                {news.summary && <p className={cx('summary')}>{news.summary}</p>}

                {/* Content */}
                <div className={cx('content')} dangerouslySetInnerHTML={{ __html: news.content }} />

                {/* Like */}
                <div className={cx('like-section')}>
                    <button
                        className={cx('like-btn', { 'like-btn-active': isLiked })}
                        onClick={handleLike}
                        disabled={liking}
                    >
                        <FontAwesomeIcon icon={isLiked ? faHeartSolid : faHeart} />
                        <span>{isLiked ? 'Đã thích' : 'Thích bài viết'}</span>
                        <span className={cx('like-count')}>{likeCount}</span>
                    </button>
                    {!isLoggedIn && (
                        <p className={cx('login-hint')}>
                            <Link to="/sign-in">Đăng nhập</Link> để thích bài viết
                        </p>
                    )}
                </div>
            </article>
        </div>
    );
}
