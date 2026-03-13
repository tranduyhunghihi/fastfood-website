import classNames from 'classnames/bind';
import styles from './MyBox.module.scss';
import banner from '../../../../public/assets/image/banner-mybox.webp';
import mybox1 from '../../../../public/assets/image/mybox1.webp';

const cx = classNames.bind(styles);

function MyBox() {
    return (
        <div className={cx('wrapper')}>
            <section id="mybox" className={cx('container')}>
                <h2 className={cx('title')}>MY BOX</h2>
                <div className={cx('banner')} style={{ backgroundImage: `url(${banner})` }}></div>
                <div className="grid wide">
                    <div className="row">
                        <div className={`${cx('item-container')} col c-5-5 c-o-0-3`}>
                            <img src={mybox1} alt="recommend1" className={cx('item-img')} />
                            <div className={cx('item-info')}>
                                <p className={cx('item-title')}>SANH DOI NHAP TIEC</p>
                                <div className={cx('item-price-box')}>
                                    <div className={cx('item-price')}>
                                        <p>Chỉ từ</p>
                                        <p className={cx('price')}>99.000 đ</p>
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

export default MyBox;
