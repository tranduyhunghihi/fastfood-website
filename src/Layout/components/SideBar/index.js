import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
        type: 'search',
    },
    {
        icon: <FontAwesomeIcon icon={faThumbsUp} />,
        title: 'BẠN SẼ THÍCH',
        id: 'recommend',
    },
    {
        icon: <FontAwesomeIcon icon={faBreadSlice} />,
        title: 'BÁNH MỚI',
        id: 'newpizza',
    },
    {
        icon: <FontAwesomeIcon icon={faCookieBite} />,
        title: 'MUA 1 TẶNG 1',
        id: 'buy1get1',
    },
    {
        icon: <FontAwesomeIcon icon={faBreadSlice} />,
        title: 'COMBO MÙA LỄ',
        id: 'festival-combo',
    },
    {
        icon: <FontAwesomeIcon icon={faPizzaSlice} />,
        title: 'PIZZA',
        id: 'pizza',
    },
    {
        icon: <FontAwesomeIcon icon={faDrumstickBite} />,
        title: 'GÀ',
        id: 'chicken',
    },
    {
        icon: <FontAwesomeIcon icon={faCheese} />,
        title: 'MÓN KHAI VỊ',
        id: 'starter',
    },
    {
        icon: <FontAwesomeIcon icon={faBoxOpen} />,
        title: 'MY BOX',
        id: 'mybox',
    },
    {
        icon: <FontAwesomeIcon icon={faGlassWater} />,
        title: 'THỨC UỐNG',
        id: 'drink',
    },
    {
        icon: <FontAwesomeIcon icon={faFire} />,
        title: 'MENU 49K',
        id: 'menu49k',
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
    const inputRef = useRef(null);
    const isClickingRef = useRef(false);
    const scrollTimeout = useRef(null);
    const itemRefs = useRef([]);

    const [showLeft, setShowLeft] = useState(true);
    const [showRight, setShowRight] = useState(true);
    // const [activeIndex, setActiveIndex] = useState(1);
    const [active, setActive] = useState('recommend');
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
    useEffect(() => {
        const index = SIDE_BAR.findIndex((item) => item.id === active);

        const el = itemRefs.current[index];
        const container = listRef.current;

        if (el && container) {
            const elLeft = el.offsetLeft;
            const elWidth = el.offsetWidth;
            const containerWidth = container.offsetWidth;

            container.scrollTo({
                left: elLeft - containerWidth / 2 + elWidth / 2,
                behavior: 'smooth',
            });
        }
    }, [active]);

    useEffect(() => {
        const handleScroll = () => {
            if (isClickingRef.current) {
                clearTimeout(scrollTimeout.current);

                scrollTimeout.current = setTimeout(() => {
                    isClickingRef.current = false;
                }, 120);
                return;
            }
            const sections = document.querySelectorAll('section');

            let current = '';
            let min = Infinity;

            sections.forEach((section) => {
                const rect = section.getBoundingClientRect();
                const distance = Math.abs(rect.top - 150); // 100 = header

                if (distance < min) {
                    min = distance;
                    current = section.id;
                }
            });

            if (current) setActive(current);
        };

        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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
        inputRef.current.focus();
    };

    const scrollTo = (id) => {
        document.getElementById(id).scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
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
                            ref={inputRef}
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
                        ref={(el) => (itemRefs.current[index] = el)}
                        className={cx('sidebar-item', { active: active === item.id })}
                        onClick={() => {
                            if (item.id) {
                                isClickingRef.current = true;
                                scrollTo(item.id);
                                setActive(item.id);
                            }
                            if (item.type === 'search') {
                                setOpenSearch(true);
                                return;
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
