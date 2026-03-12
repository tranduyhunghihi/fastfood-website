import Header from '../Header';
import SideBar from '../SideBar';
import classNames from 'classnames/bind';
import styles from './DefaultLayout.module.scss';
import Recommend from '../../../pages/Home/sections/Recommend/Recommend';
import NewPizza from '../../../pages/Home/sections/NewPizza/NewPizza';
import Buy1Get1 from '../../../pages/Home/sections/Buy1Get1';
const cx = classNames.bind(styles);

function DefaultLayout({ children }) {
    return (
        <div className={cx('wrapper')}>
            <Header />
            <div className={cx('container')}>
                <div className={cx('content')}>
                    <div className={cx('main-content')}>{children}</div>
                    <SideBar />
                    <Recommend />
                    <NewPizza />
                    <Buy1Get1 />
                </div>
            </div>
        </div>
    );
}

export default DefaultLayout;
