import { useRef, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSistrix } from '@fortawesome/free-brands-svg-icons';
import { faCircleXmark, faThumbsUp } from '@fortawesome/free-regular-svg-icons';
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
    const [input, setInput] = useState('');
    const [focus, setFocus] = useState(false);
    const [openSearch, setOpenSearch] = useState(false);

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

    const handleClear = () => {
        setInput('');
    };

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
            {
                <div className={cx('search-box', { open: openSearch })}>
                    <div className={cx('input-container')}>
                        <input
                            className={cx('input-box')}
                            type="text"
                            value={input}
                            placeholder="Tìm kiếm mọi thứ bạn muốn"
                            onChange={(e) => setInput(e.target.value)}
                            onFocus={() => setFocus(true)}
                        />
                        {focus && input && (
                            <FontAwesomeIcon className={cx('btn-clear')} icon={faCircleXmark} onClick={handleClear} />
                        )}
                    </div>
                    <button className={cx('btn-search')}>Tìm kiếm</button>
                    <p className={cx('btn-close')} onClick={() => setOpenSearch(false)}>
                        Đóng
                    </p>
                </div>
            }
            <ul className={cx('sidebar-list')} ref={listRef} onScroll={checkScroll}>
                {SIDE_BAR.map((item, index) => (
                    <li
                        key={index}
                        className={cx('sidebar-item', { active: activeIndex === index })}
                        onClick={() => {
                            setActiveIndex(index);
                            if (index === 0) {
                                setOpenSearch(true);
                            }
                        }}
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
