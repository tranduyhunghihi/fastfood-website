import classNames from 'classnames/bind';
import styles from './Buy1Get1.module.scss';
import buy1get1_1 from '../../../../public/assets/image/buy1get1-1.webp';
import banner from '../../../../public/assets/image/banner-buy1get1.webp';

const cx = classNames.bind(styles);

function Buy1Get1() {
    return (
        <div className={cx('wrapper')}>
            <section id="buy1get1" className={cx('container')}>
                <h2 className={cx('title')}>BUY 1 GET 1</h2>
                <div className={cx('banner')} style={{ backgroundImage: `url(${banner})` }}></div>
                <div className="grid wide">
                    <div className="row">
                        <div className={`${cx('item-container')} col c-5-5 c-o-0-3`}>
                            <img src={buy1get1_1} alt="recommend1" className={cx('item-img')} />
                            <div className={cx('item-info')}>
                                <p className={cx('item-title')}>BUY ONE GET ONE PIZZA (REGULAR)</p>
                                <div className={cx('item-price-box')}>
                                    <div className={cx('item-price')}>
                                        <p>Chỉ từ</p>
                                        <p className={cx('price')}>249.000 đ</p>
                                    </div>
                                </div>
                                <div className={cx('description')}></div>
                            </div>
                        </div>
                        <div className={`${cx('item-container')} col c-5-5 c-o-0-3`}>2</div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Buy1Get1;
