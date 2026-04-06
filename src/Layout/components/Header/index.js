import classNames from 'classnames/bind';
import Tippy from '@tippyjs/react/headless';
import styles from './Header.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faCircleUser } from '@fortawesome/free-regular-svg-icons';
import { faCartShopping, faBars } from '@fortawesome/free-solid-svg-icons';
import { VietNameseIcon } from '../../../components/Icon/Icon';
import logo from '../../../public/assets/image/logo.png';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useCart } from '../../../contexts/CartContext';
import { useState, useEffect } from 'react';
import axiosInstance from '../../../axios/axiosInstance';

const cx = classNames.bind(styles);

const MENU_LANGUAGE = [{ language: 'Tiếng Việt' }, { language: 'English' }];

const ScrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

function Header() {
    const { user, isLoggedIn, logout } = useAuth();
    const { totalItems } = useCart();
    const navigate = useNavigate();
    const [newsCount, setNewsCount] = useState(0);

    useEffect(() => {
        axiosInstance
            .get('/news', { params: { limit: 1 } })
            .then((res) => setNewsCount(res.data.total || 0))
            .catch(() => {});
    }, []);

    const MENU_USER = isLoggedIn
        ? [
              { title: 'Theo dõi đơn hàng', link: '/order-tracking' },
              { title: 'Hồ sơ của tôi', link: '/profile' },
              { title: 'Hỗ trợ khách hàng', link: '/support' },
              {
                  title: 'Đăng xuất',
                  onClick: () => {
                      logout();
                      navigate('/');
                  },
              },
          ]
        : [
              { title: 'Đăng nhập', link: '/sign-in' },
              { title: 'Theo dõi đơn hàng', link: '/order-tracking' },
              { title: 'Hỗ trợ khách hàng', link: '/support' },
          ];

    return (
        <div className={cx('wrapper')}>
            <Link to="/" className={cx('logo-container')} onClick={ScrollToTop}>
                <img className={cx('logo')} src={logo} alt="logo" />
            </Link>
            <div className={cx('action')}>
                <Link to="/news" className={cx('bell-wrap')}>
                    <FontAwesomeIcon className={cx('icon')} icon={faBell} />
                    {newsCount > 0 && <span className={cx('bell-badge')}>{newsCount > 99 ? '99+' : newsCount}</span>}
                </Link>

                <Tippy
                    render={(attrs) => (
                        <ul className={cx('menu-language')} tabIndex={-1} {...attrs}>
                            {MENU_LANGUAGE.map((item, index) => (
                                <li key={index} className={cx('language-item')}>
                                    {item.language}
                                </li>
                            ))}
                        </ul>
                    )}
                    placement="bottom-end"
                    offset={[10, 0]}
                    interactive
                    delay={[0, 500]}
                >
                    <div className={cx('language')}>
                        <VietNameseIcon />
                    </div>
                </Tippy>

                <Link to="/cart">
                    <div className={cx('btn-action')}>
                        {/* ✅ số lượng thật từ CartContext */}
                        <p className={cx('cart-count')}>{totalItems}</p>
                        <FontAwesomeIcon className={cx('icon')} icon={faCartShopping} />
                    </div>
                </Link>

                <Tippy
                    render={(attrs) => (
                        <ul className={cx('menu-user')} tabIndex={-1} {...attrs}>
                            {MENU_USER.map((item, index) => (
                                <li key={index} className={cx('menu-item')} onClick={item.onClick}>
                                    {item.link ? <Link to={item.link}>{item.title}</Link> : <span>{item.title}</span>}
                                </li>
                            ))}
                        </ul>
                    )}
                    placement="bottom-end"
                    offset={[10, 0]}
                    interactive
                    delay={[0, 500]}
                >
                    <div className={cx('btn-action', 'primary')}>
                        <FontAwesomeIcon className={cx('icon', 'primary')} icon={faBars} />
                        {/* ✅ hiện avatar chữ cái đầu nếu đã đăng nhập */}
                        {isLoggedIn ? (
                            <span className={cx('avatar')}>{user.name?.charAt(0).toUpperCase()}</span>
                        ) : (
                            <FontAwesomeIcon className={cx('icon', 'primary')} icon={faCircleUser} />
                        )}
                    </div>
                </Tippy>
            </div>
        </div>
    );
}

export default Header;
