import classNames from 'classnames/bind';
import styles from './Notice.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFaceFrown } from '@fortawesome/free-regular-svg-icons';

const cx = classNames.bind(styles);

function Notice() {
    return (
        <div className={cx('main')}>
            <div className={cx('heading')}>
                <p className={cx('heading-title')}>Thông Báo</p>
            </div>
            <div className={cx('content')}>
                <div className={cx('icon')}>
                    <FontAwesomeIcon icon={faFaceFrown} />
                </div>
                <div className={cx('notice-title')}>Chúng tôi không có thông báo nào cho bạn vào lúc này.</div>
                <div className={cx('notice-text')}>Vui lòng kiểm tra lại sau</div>
            </div>
        </div>
    );
}

export default Notice;
