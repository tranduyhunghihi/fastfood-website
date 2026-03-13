import classNames from 'classnames/bind';
import styles from './Starter.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import banner from '../../../../public/assets/image/banner-starter.webp';
import starter1 from '../../../../public/assets/image/starter1.webp';

const cx = classNames.bind(styles);

function Starter() {
    return (
        <div className={cx('wrapper')}>
            <section id="starter" className={cx('container')}>
                <h2 className={cx('title')}>STARTER</h2>
                <div className={cx('banner')} style={{ backgroundImage: `url(${banner})` }}></div>
                <div className="grid wide">
                    <div className="row">
                        <div className={`${cx('item-container')} col c-5-5 c-o-0-3`}>
                            <img src={starter1} alt="recommend1" className={cx('item-img')} />
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
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Starter;
