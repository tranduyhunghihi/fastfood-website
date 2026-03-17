import { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './Profile.module.scss';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRightFromBracket, faCircleUser, faLock } from '@fortawesome/free-solid-svg-icons';
import { faBell } from '@fortawesome/free-regular-svg-icons';

const cx = classNames.bind(styles);

const MENU_SIDEBAR = [
    {
        title: 'Hồ sơ của tôi',
        icon: <FontAwesomeIcon icon={faCircleUser} />,
        link: 'myprofile',
    },
    {
        title: 'Thông báo',
        icon: <FontAwesomeIcon icon={faBell} />,
        link: 'notice',
    },
    {
        title: 'Đổi mật khẩu',
        icon: <FontAwesomeIcon icon={faLock} />,
        link: 'change-password',
    },
];

function Profile({ children }) {
    const [active, setActive] = useState(0);
    return (
        <div className={cx('wrapper')}>
            <div className={cx('header')}>
                <Link to="/" className={cx('btn-back')}>
                    <FontAwesomeIcon icon={faArrowLeft} className={cx('icon')} />
                    <p>Trở lại</p>
                </Link>
                <div className={cx('title')}>
                    <p>Tài Khoản</p>
                </div>
            </div>
            <div className={cx('content')}>
                <div className={cx('navbar')}>
                    <div className={cx('sidebar')}>
                        {MENU_SIDEBAR.map((item, index) => (
                            <NavLink
                                to={item.link}
                                key={index}
                                className={cx('sidebar-item', { active: active === index })}
                                onClick={() => setActive(index)}
                            >
                                <div className={cx('sidebar-icon')}>{item.icon}</div>
                                <div className={cx('sidebar-title')}>{item.title}</div>
                            </NavLink>
                        ))}
                    </div>
                    <div className={cx('log-out')}>
                        <div className={cx('sidebar-icon')}>
                            <FontAwesomeIcon icon={faArrowRightFromBracket} />
                        </div>
                        <div className={cx('sidebar-title')}>Đăng xuất</div>
                    </div>
                </div>
                <div className={cx('main')}>
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default Profile;
