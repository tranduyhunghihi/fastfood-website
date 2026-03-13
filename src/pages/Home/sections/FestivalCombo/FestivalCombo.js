import classNames from 'classnames/bind';
import styles from './FestivalCombo.module.scss';
import banner from '../../../../public/assets/image/banner-festivalCombo.webp';
import festivalCombo1 from '../../../../public/assets/image/festivalCombo1.webp';

const cx = classNames.bind(styles);

function FestivalCombo() {
    return (
        <div className={cx('wrapper')}>
            <section id="festival-combo" className={cx('container')}>
                <h2 className={cx('title')}>FESTIVAL COMBO</h2>
                <div className={cx('banner')} style={{ backgroundImage: `url(${banner})` }}></div>
                <div className="grid wide">
                    <div className="row">
                        <div className={`${cx('item-container')} col c-5-5 c-o-0-3`}>
                            <img src={festivalCombo1} alt="recommend1" className={cx('item-img')} />
                            <div className={cx('item-info')}>
                                <p className={cx('item-title')}>SANH DOI NHAP TIEC</p>
                                <div className={cx('item-price-box')}>
                                    <div className={cx('item-price')}>
                                        <p>Chỉ từ</p>
                                        <p className={cx('price')}>329.000 đ</p>
                                    </div>
                                </div>
                                <div className={cx('description')}></div>
                            </div>
                        </div>
                        <div className={`${cx('item-container')} col c-5-5 c-o-0-3`}>2</div>
                        <div className={`${cx('item-container')} col c-5-5 c-o-0-3`}>2</div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default FestivalCombo;
