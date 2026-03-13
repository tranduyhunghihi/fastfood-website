import classNames from 'classnames/bind';
import styles from './Footer.module.scss';
import logo from '../../../public/assets/image/logo.png';
import logoFacebook from '../../../public/assets/image/facebook-icon.svg';
import logoYoutube from '../../../public/assets/image/youtubeIcon.svg';
import logoGmail from '../../../public/assets/image/gmailIcon.svg';

const cx = classNames.bind(styles);

function Footer() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('footer-container')}>
                <div className={cx('content')}>
                    <a href="#">
                        <img src={logo} alt="logo" className={cx('logo')} />
                    </a>
                    <div className={cx('box-social')}>
                        <a href="https://www.facebook.com/tran.duy.hung.731633">
                            <img src={logoFacebook} alt="facebook icon" />
                        </a>
                        <a href="#">
                            <img src={logoYoutube} alt="facebook icon" />
                        </a>
                        <a href="#">
                            <img src={logoGmail} alt="facebook icon" />
                        </a>
                    </div>
                </div>
                <div className={cx('content')}>
                    <ul>
                        <div className={cx('title')}>Về chúng tôi</div>
                        <li className={cx('item')}>Giới thiệu</li>
                        <li className={cx('item')}>Tầm nhìn và sứ mệnh của chúng tôi</li>
                        <li className={cx('item')}>Giá trị cốt lõi</li>
                        <li className={cx('item')}>An toàn thực phẩm</li>
                        <li className={cx('item')}>LIMO</li>
                        <li className={cx('item')}>Cơ hội nghề nghiệp</li>
                    </ul>
                </div>
                <div className={cx('content')}>
                    <ul>
                        <div className={cx('title')}>Contact</div>
                        <li className={cx('item')}>0353849122</li>
                        <li className={cx('item')}>hungduytran159@gmail.com</li>
                        <li className={cx('item')}>44 Triều Khúc Hà Nội</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Footer;
