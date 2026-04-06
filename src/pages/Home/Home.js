import { useState, useEffect } from 'react';
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
import CategorySection from './sections/CategorySection/CategorySection';
import ComboSection from './sections/ComboSection/ComboSection';
import SearchResults from './sections/SearchResults/SearchResults';
import axiosInstance from '../../axios/axiosInstance';

const cx = classNames.bind(styles);

function Home() {
    const [categories, setCategories] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');

    useEffect(() => {
        axiosInstance
            .get('/categories')
            .then((res) => setCategories(res.data.data || []))
            .catch(console.error);
    }, []);

    // Lắng nghe event từ SideBar
    useEffect(() => {
        const handler = (e) => setSearchKeyword(e.detail || '');
        window.addEventListener('sidebar-search', handler);
        return () => window.removeEventListener('sidebar-search', handler);
    }, []);

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
                    <img src={banner2} alt="banner2" />
                </SwiperSlide>
                <SwiperSlide>
                    <img src={banner3} alt="banner3" />
                </SwiperSlide>
                <SwiperSlide>
                    <img src={banner4} alt="banner4" />
                </SwiperSlide>
            </Swiper>

            <div className={cx('sidebar')}>
                <SideBar />
                <div className={cx('content')}>
                    {searchKeyword ? (
                        <SearchResults keyword={searchKeyword} onClose={() => setSearchKeyword('')} />
                    ) : (
                        <>
                            <ComboSection />
                            {categories.map((category) => (
                                <CategorySection key={category._id} category={category} />
                            ))}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Home;
