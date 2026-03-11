import Header from '../Header';
import SideBar from '../SideBar';
import classNames from 'classnames/bind';
import styles from './DefaultLayout.module.scss';

const cx = classNames.bind(styles);

function DefaultLayout({ children }) {
    return (
        <div className={cx('wrapper')}>
            <Header />
            <div className={cx('container')}>
                <div className={cx('content')}>{children}</div>
            </div>
            <SideBar />
            <div style={{ height: '100vh' }}></div>
        </div>
    );
}

export default DefaultLayout;
