import classNames from 'classnames/bind';
import styles from './Chicken.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import banner from '../../../../public/assets/image/banner-chicken.webp';
import chicken1 from '../../../../public/assets/image/chicken1';

const cx = classNames.bind(styles);

function Chicken() {
    return (
        <div className={cx('wrapper')}>
            <section id="chicken" className={cx('container')}>
                <h2 className={cx('title')}>CHICKEN</h2>
                <div className={cx('banner')} style={{ backgroundImage: `url(${banner})` }}></div>
                <div className="grid wide">
                    <div className="row">
                        <div className={`${cx('item-container')} col c-5-5 c-o-0-3`}>
                            <img src={chicken1} alt="recommend1" className={cx('item-img')} />
                            <div className={cx('item-info')}>
                                <p className={cx('item-title')}>Pizza Phô Mai Cao Cấp</p>
                                <div className={cx('item-price-box')}>
                                    <div className={cx('item-price')}>
                                        <p>Chỉ từ</p>
                                        <p className={cx('price')}>99.000 đ</p>
                                    </div>

                                    <div className={cx('btn-add')}>
                                        <FontAwesomeIcon icon={faPlus} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={`${cx('item-container')} col c-5-5 c-o-0-3`}>2</div>
                        <div className={`${cx('item-container')} col c-5-5 c-o-0-3`}>2</div>
                        <div className={`${cx('item-container')} col c-5-5 c-o-0-3`}>2</div>
                        <div className={`${cx('item-container')} col c-5-5 c-o-0-3`}>2</div>
                        <div className={`${cx('item-container')} col c-5-5 c-o-0-3`}>2</div>
                        <div className={`${cx('item-container')} col c-5-5 c-o-0-3`}>2</div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Chicken;
