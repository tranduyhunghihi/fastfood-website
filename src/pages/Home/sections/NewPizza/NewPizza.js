import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import styles from './NewPizza.module.scss';
import banner from '../../../../public/assets/image/banner-newpizza.webp';
import '../../../../public/assets/css/grid.css';
import newpizza1 from '../../../../public/assets/image/newpizza1.webp';

const cx = classNames.bind(styles);

function NewPizza() {
    return (
        <div className={cx('wrapper')}>
            <section id="newpizza" className={cx('container')}>
                <h2 className={cx('title')}>NEW PIZZA</h2>
                <div className={cx('banner')} style={{ backgroundImage: `url(${banner})` }}></div>
                <div className="grid wide">
                    <div className="row">
                        <div className={`${cx('item-container')} col c-5-5 c-o-0-3`}>
                            <img src={newpizza1} alt="recommend1" className={cx('item-img')} />
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
                        <div className={`${cx('item-container')} col c-5-5 c-o-0-3`}>3</div>
                        <div className={`${cx('item-container')} col c-5-5 c-o-0-3`}>4</div>
                        <div className={`${cx('item-container')} col c-5-5 c-o-0-3`}>5</div>
                        <div className={`${cx('item-container')} col c-5-5 c-o-0-3`}>6</div>
                        <div className={`${cx('item-container')} col c-5-5 c-o-0-3`}>7</div>
                        <div className={`${cx('item-container')} col c-5-5 c-o-0-3`}>8</div>
                        <div className={`${cx('item-container')} col c-5-5 c-o-0-3`}>9</div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default NewPizza;
