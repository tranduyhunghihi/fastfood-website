import { useRef, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSistrix } from '@fortawesome/free-brands-svg-icons';
import { faThumbsUp } from '@fortawesome/free-regular-svg-icons';
import {
    faAngleLeft,
    faAngleRight,
    faBoxOpen,
    faBreadSlice,
    faCheese,
    faCookieBite,
    faDrumstickBite,
    faFire,
    faGlassWater,
    faPepperHot,
    faPizzaSlice,
    faSeedling,
} from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import styles from './SideBar.module.scss';

const cx = classNames.bind(styles);

const SIDE_BAR = [
    {
        icon: <FontAwesomeIcon icon={faSistrix} />,
        title: 'Tìm kiếm',
    },
    {
        icon: <FontAwesomeIcon icon={faThumbsUp} />,
        title: 'BẠN SẼ THÍCH',
    },
    {
        icon: <FontAwesomeIcon icon={faBreadSlice} />,
        title: 'BÁNH MỚI',
    },
    {
        icon: <FontAwesomeIcon icon={faCookieBite} />,
        title: 'MUA 1 TẶNG 1',
    },
    {
        icon: <FontAwesomeIcon icon={faBreadSlice} />,
        title: 'COMBO MÙA LỄ',
    },
    {
        icon: <FontAwesomeIcon icon={faPizzaSlice} />,
        title: 'PIZZA',
    },
    {
        icon: <FontAwesomeIcon icon={faDrumstickBite} />,
        title: 'GÀ',
    },
    {
        icon: <FontAwesomeIcon icon={faCheese} />,
        title: 'MÓN KHAI VỊ',
    },
    {
        icon: <FontAwesomeIcon icon={faBoxOpen} />,
        title: 'MY BOX',
    },
    {
        icon: <FontAwesomeIcon icon={faGlassWater} />,
        title: 'THỨC UỐNG',
    },
    {
        icon: <FontAwesomeIcon icon={faFire} />,
        title: 'MENU 49K',
    },
    {
        icon: <FontAwesomeIcon icon={faPepperHot} />,
        title: 'CAY',
    },
    {
        icon: <FontAwesomeIcon icon={faSeedling} />,
        title: 'CHAY',
    },
];

function SideBar() {
    const listRef = useRef(null);

    const [showLeft, setShowLeft] = useState(true);
    const [showRight, setShowRight] = useState(true);
    const [activeIndex, setActiveIndex] = useState(1);

    const scrollAmount = 300;

    const checkScroll = () => {
        const el = listRef.current;

        const atStart = el.scrollLeft === 0;
        const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth;

        setShowLeft(!atStart);
        setShowRight(!atEnd);
    };

    const scrollLeft = () => {
        listRef.current.scrollBy({
            left: -scrollAmount,
            behavior: 'smooth',
        });
    };

    const scrollRight = () => {
        listRef.current.scrollBy({
            left: scrollAmount,
            behavior: 'smooth',
        });
    };

    useEffect(() => {
        checkScroll();
    }, []);

    return (
        <div className={cx('wrapper')}>
            {showLeft && (
                <div className={cx('btn-left')} onClick={scrollLeft}>
                    <FontAwesomeIcon icon={faAngleLeft} />
                </div>
            )}
            {showRight && (
                <div className={cx('btn-right')} onClick={scrollRight}>
                    <FontAwesomeIcon icon={faAngleRight} />
                </div>
            )}
            <ul className={cx('sidebar-list')} ref={listRef} onScroll={checkScroll}>
                {SIDE_BAR.map((item, index) => (
                    <li
                        key={index}
                        className={cx('sidebar-item', { active: activeIndex === index })}
                        onClick={() => setActiveIndex(index)}
                    >
                        <div className={cx('icon')}>{item.icon}</div>
                        <p className={cx('title')}>{item.title}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default SideBar;
