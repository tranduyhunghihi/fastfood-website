import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import banner1 from '../../public/assets/image/banner1.webp';
import banner2 from '../../public/assets/image/banner2.webp';
import banner3 from '../../public/assets/image/banner3.webp';
import banner4 from '../../public/assets/image/banner4.webp';
import SideBar from '../../Layout/components/SideBar';
import Recommend from '../../pages/Home/sections/Recommend/Recommend';
import NewPizza from '../../pages/Home/sections/NewPizza/NewPizza';
import Buy1Get1 from '../../pages/Home/sections/Buy1Get1/Buy1Get1';
import FestivalCombo from '../../pages/Home/sections/FestivalCombo/FestivalCombo';
import Pizza from '../../pages/Home/sections/Pizza/Pizza';
import Chicken from '../../pages/Home/sections/Chicken/Chicken';
import Starter from '../../pages/Home/sections/Starter/Starter';
import MyBox from '../../pages/Home/sections/MyBox/MyBox';
import Drink from '../../pages/Home/sections/Drink/Drink';
import Menu49k from '../../pages/Home/sections/Menu49k/Menu49k';

const cx = classNames.bind(styles);

function Home() {
    return (
        <div className={cx('wrapper')}>
            <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                autoplay={{ delay: 3000 }}
                loop={true}
            >
                <SwiperSlide>
                    <img src={banner1} alt="banner1" />
                </SwiperSlide>
                <SwiperSlide>
                    <img src={banner2} alt="banner1" />
                </SwiperSlide>
                <SwiperSlide>
                    <img src={banner3} alt="banner1" />
                </SwiperSlide>
                <SwiperSlide>
                    <img src={banner4} alt="banner1" />
                </SwiperSlide>
            </Swiper>
            <div className={cx('sidebar')}>
                <SideBar />
                <div className={cx('content')}>
                    <Recommend />
                    <NewPizza />
                    <Buy1Get1 />
                    <FestivalCombo />
                    <Pizza />
                    <Chicken />
                    <Starter />
                    <MyBox />
                    <Drink />
                    <Menu49k />
                </div>
            </div>
        </div>
    );
}

export default Home;
