import Header from '../Header';
import SideBar from '../SideBar';
import classNames from 'classnames/bind';
import styles from './DefaultLayout.module.scss';
import Recommend from '../../../pages/Home/sections/Recommend/Recommend';
import NewPizza from '../../../pages/Home/sections/NewPizza/NewPizza';
import Buy1Get1 from '../../../pages/Home/sections/Buy1Get1/Buy1Get1';
import FestivalCombo from '../../../pages/Home/sections/FestivalCombo/FestivalCombo';
import Pizza from '../../../pages/Home/sections/Pizza/Pizza';
import Chicken from '../../../pages/Home/sections/Chicken/Chicken';
import Starter from '../../../pages/Home/sections/Starter/Starter';
import MyBox from '../../../pages/Home/sections/MyBox/MyBox';
import Drink from '../../../pages/Home/sections/Drink/Drink';
import Menu49k from '../../../pages/Home/sections/Menu49k/Menu49k';
import Footer from '../Footer';
const cx = classNames.bind(styles);

function DefaultLayout({ children }) {
    return (
        <div className={cx('wrapper')}>
            <Header />
            <div className={cx('container')}>
                <div className={cx('content')}>{children}</div>
            </div>
            <Footer />
        </div>
    );
}

export default DefaultLayout;
