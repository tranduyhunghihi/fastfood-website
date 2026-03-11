import classNames from 'classnames/bind';
import Tippy from '@tippyjs/react/headless';
import styles from './Header.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faCircleUser } from '@fortawesome/free-regular-svg-icons';
import { faCartShopping, faBars } from '@fortawesome/free-solid-svg-icons';
import { VietNameseIcon } from '../../../components/Icon/Icon';
import logo from '../../../public/assets/image/logo.png';

const cx = classNames.bind(styles);

const MENU_USER = [
    {
        title: 'Theo dõi đơn hàng',
    },
    {
        title: 'Hồ sơ của tôi',
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
function Header() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('logo-container')}>
                <img className={cx('logo')} src={logo} alt="logo" />
            </div>
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
                <div className={cx('btn-action')}>
                    <p className={cx('cart-count')}>0</p>
                    <FontAwesomeIcon className={cx('icon')} icon={faCartShopping} />
                </div>
                <Tippy
                    render={(attrs) => (
                        <ul className={cx('menu-user')} tabIndex={-1} {...attrs}>
                            {MENU_USER.map((item, index) => (
                                <li key={index} className={cx('menu-item')}>
                                    {item.title}
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
