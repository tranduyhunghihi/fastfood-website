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
        </div>
    );
}

export default Home;
