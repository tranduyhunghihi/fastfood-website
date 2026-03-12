import classNames from 'classnames/bind';
import styles from './Recommend.module.scss';
import '../../../../public/assets/css/grid.css';
import img1 from '../../../../public/assets/image/recommend1.webp';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function Recommend() {
    return (
        <div className={cx('wrapper')}>
            <section id="recommend" className={cx('container')}>
                <h2 className={cx('title')}>RECOMMEND</h2>
                <div className={cx('list-item')}>
                    <div className={cx('item-container')}>
                        <img src={img1} alt="recommend1" className={cx('item-img')} />
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
                    <div className={cx('item-container')}>2</div>
                    <div className={cx('item-container')}>3</div>
                    <div className={cx('item-container')}>4</div>
                    <div className={cx('item-container')}>5</div>
                    <div className={cx('item-container')}>6</div>
                </div>
            </section>
        </div>
    );
}

export default Recommend;
