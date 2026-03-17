import classNames from 'classnames/bind';
import Tippy from '@tippyjs/react/headless';
import styles from './Header.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faCircleUser } from '@fortawesome/free-regular-svg-icons';
import { faCartShopping, faBars } from '@fortawesome/free-solid-svg-icons';
import { VietNameseIcon } from '../../../components/Icon/Icon';
import logo from '../../../public/assets/image/logo.png';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);

const MENU_USER = [
    {
        title: 'Theo dõi đơn hàng',
    },
    {
        title: 'Hồ sơ của tôi',
        link: '/profile',
    },
    {
        title: 'Hiển thị mã QR',
    },
    {
        title: 'Đổi điểm',
    },
    {
        title: 'Hỗ trợ khách hàng',
    },
    {
        title: 'Đăng xuất',
    },
];
const MENU_LANGUAGE = [
    {
        language: 'Tiếng Việt',
    },
    {
        language: 'English',
    },
];

const ScrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth',
    });
};

function Header() {
    return (
        <div className={cx('wrapper')}>
            <Link to="/" className={cx('logo-container')} onClick={ScrollToTop}>
                <img className={cx('logo')} src={logo} alt="logo" />
            </Link>
            <div className={cx('action')}>
                <FontAwesomeIcon className={cx('icon')} icon={faBell} />
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
                    // visible
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
                        <p className={cx('cart-count')}>0</p>
                        <FontAwesomeIcon className={cx('icon')} icon={faCartShopping} />
                    </div>
                </Link>
                <Tippy
                    render={(attrs) => (
                        <ul className={cx('menu-user')} tabIndex={-1} {...attrs}>
                            {MENU_USER.map((item, index) => (
                                <li key={index} className={cx('menu-item')}>
                                    <Link to={item.link}>{item.title}</Link>
                                </li>
                            ))}
                        </ul>
                    )}
                    // visible
                    placement="bottom-end"
                    offset={[10, 0]}
                    interactive
                    delay={[0, 500]}
                >
                    <div className={cx('btn-action', 'primary')}>
                        <FontAwesomeIcon className={cx('icon', 'primary')} icon={faBars} />
                        <FontAwesomeIcon className={cx('icon', 'primary')} icon={faCircleUser} />
                    </div>
                </Tippy>
            </div>
        </div>
    );
}

export default Header;
