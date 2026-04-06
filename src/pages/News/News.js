import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './News.module.scss';
import axiosInstance from '../../axios/axiosInstance';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faHeart, faClock, faTag } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

const fmtDate = (d) => new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });

function NewsCard({ news }) {
    const navigate = useNavigate();
    return (
        <div className={cx('card')} onClick={() => navigate(`/news/${news.slug}`)}>
            <div className={cx('card-img-wrap')}>
                <img src={news.image || '/assets/image/placeholder.webp'} alt={news.title} className={cx('card-img')} />
            </div>
            <div className={cx('card-body')}>
                {news.tags?.length > 0 && (
                    <div className={cx('card-tags')}>
                        {news.tags.slice(0, 2).map((t) => (
                            <span key={t} className={cx('tag')}>
                                {t}
                            </span>
                        ))}
                    </div>
                )}
                <h3 className={cx('card-title')}>{news.title}</h3>
                {news.summary && <p className={cx('card-summary')}>{news.summary}</p>}
                <div className={cx('card-footer')}>
                    <span className={cx('card-meta')}>
                        <FontAwesomeIcon icon={faClock} /> {fmtDate(news.createdAt)}
                    </span>
                    <span className={cx('card-meta')}>
                        <FontAwesomeIcon icon={faHeart} /> {news.likeCount || 0}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default function News() {
    const [newsList, setNewsList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        setLoading(true);
        axiosInstance
            .get('/news', { params: { page, limit: 9 } })
            .then((res) => {
                setNewsList(res.data.data || []);
                setTotalPages(res.data.totalPages || 1);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [page]);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('header')}>
                <Link to="/" className={cx('back-btn')}>
                    <FontAwesomeIcon icon={faArrowLeft} /> Trở lại
                </Link>
                <h1 className={cx('title')}>Tin Tức & Khuyến Mãi</h1>
                <div style={{ width: 80 }} />
            </div>

            {loading ? (
                <div className={cx('grid')}>
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className={cx('skeleton')} />
                    ))}
                </div>
            ) : newsList.length === 0 ? (
                <div className={cx('empty')}>
                    <p>Chưa có tin tức nào.</p>
                </div>
            ) : (
                <div className={cx('grid')}>
                    {newsList.map((n) => (
                        <NewsCard key={n._id} news={n} />
                    ))}
                </div>
            )}

            {totalPages > 1 && (
                <div className={cx('pagination')}>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <button
                            key={p}
                            className={cx('page-btn', { 'page-active': p === page })}
                            onClick={() => setPage(p)}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
