import { useRef, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSistrix } from '@fortawesome/free-brands-svg-icons';
import { faCircleXmark } from '@fortawesome/free-regular-svg-icons';
import {
    faAngleLeft,
    faAngleRight,
    faUtensils,
    faPizzaSlice,
    faDrumstickBite,
    faCheese,
    faGlassWater,
    faBoxOpen,
    faBreadSlice,
    faCookieBite,
    faFire,
    faIceCream,
    faBurger,
    faStar,
    faLeaf,
    faFish,
    faBacon,
    faEgg,
    faCakeCandles,
    faMugHot,
    faWineGlass,
    faBowlFood,
    faShrimp,
    faCarrot,
    faAppleWhole,
    faLemon,
    faBowlRice,
    faHotdog,
    faSeedling,
    faGift,
} from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import styles from './SideBar.module.scss';
import axiosInstance from '../../../axios/axiosInstance';
import { useDebounce } from '../../../hooks';

const cx = classNames.bind(styles);

const ICON_MAP = {
    faUtensils,
    faPizzaSlice,
    faDrumstickBite,
    faCheese,
    faGlassWater,
    faBoxOpen,
    faBreadSlice,
    faCookieBite,
    faFire,
    faIceCream,
    faBurger,
    faStar,
    faLeaf,
    faFish,
    faBacon,
    faEgg,
    faCakeCandles,
    faMugHot,
    faWineGlass,
    faBowlFood,
    faShrimp,
    faCarrot,
    faAppleWhole,
    faLemon,
    faBowlRice,
    faHotdog,
    faSeedling,
    faGift,
};

const resolveIcon = (iconName) => {
    if (!iconName) return faUtensils;
    return ICON_MAP[iconName] ?? faUtensils;
};

// Items cố định — không fetch từ API
const SEARCH_ITEM = { slug: '__search__', type: 'search', name: 'Tìm kiếm', _icon: faSistrix };
const COMBO_ITEM = { slug: 'combo', type: 'fixed', name: 'COMBO', _icon: faGift };

function SideBar() {
    const listRef = useRef(null);
    const inputRef = useRef(null);
    const isClickingRef = useRef(false);
    const scrollTimeout = useRef(null);
    const itemRefs = useRef([]);

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showLeft, setShowLeft] = useState(false);
    const [showRight, setShowRight] = useState(true);
    const [active, setActive] = useState('combo');
    const [input, setInput] = useState('');
    const [focus, setFocus] = useState(false);
    const [openSearch, setOpenSearch] = useState(false);

    const debouncedSearch = useDebounce(input, 400);

    useEffect(() => {
        axiosInstance
            .get('/categories')
            .then((res) => {
                const data = res.data.data || [];
                setCategories(data);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (!listRef.current) return;
        const allItems = [SEARCH_ITEM, COMBO_ITEM, ...categories];
        const index = allItems.findIndex((item) => item.slug === active);
        if (index === -1) return;
        const el = itemRefs.current[index];
        const container = listRef.current;
        if (el && container) {
            container.scrollTo({
                left: el.offsetLeft - container.offsetWidth / 2 + el.offsetWidth / 2,
                behavior: 'smooth',
            });
        }
    }, [active, categories]);

    useEffect(() => {
        const handleScroll = () => {
            if (isClickingRef.current) {
                clearTimeout(scrollTimeout.current);
                scrollTimeout.current = setTimeout(() => {
                    isClickingRef.current = false;
                }, 120);
                return;
            }
            const sections = document.querySelectorAll('section[id]');
            let current = '',
                min = Infinity;
            sections.forEach((section) => {
                const dist = Math.abs(section.getBoundingClientRect().top - 150);
                if (dist < min) {
                    min = dist;
                    current = section.id;
                }
            });
            if (current) setActive(current);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollAmount = 300;

    const checkScroll = () => {
        const el = listRef.current;
        if (!el) return;
        setShowLeft(el.scrollLeft > 0);
        setShowRight(Math.ceil(el.scrollLeft + el.clientWidth) < el.scrollWidth);
    };

    useEffect(() => {
        checkScroll();
    }, [categories]);

    const scrollLeft = () => listRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    const scrollRight = () => listRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    const handleClear = () => {
        setInput('');
        inputRef.current?.focus();
    };
    const scrollToSection = (slug) => {
        document.getElementById(slug)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    // Search + Combo cố định + categories từ API
    const sidebarItems = [SEARCH_ITEM, COMBO_ITEM, ...categories];

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
                        onBlur={() => setFocus(false)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                window.dispatchEvent(new CustomEvent('sidebar-search', { detail: input.trim() }));
                                setOpenSearch(false);
                            }
                        }}
                    />
                    {input && (
                        <FontAwesomeIcon
                            className={cx('btn-clear')}
                            icon={faCircleXmark}
                            onMouseDown={(e) => {
                                e.preventDefault(); // giữ focus không bị blur
                                handleClear();
                            }}
                        />
                    )}
                </div>
                <button
                    className={cx('btn-search')}
                    onClick={() => {
                        const keyword = input.trim();
                        window.dispatchEvent(new CustomEvent('sidebar-search', { detail: keyword }));
                        setOpenSearch(false);
                        handleClear();
                    }}
                >
                    Tìm kiếm
                </button>
                <p
                    className={cx('btn-close')}
                    onClick={() => {
                        setOpenSearch(false);
                        setInput('');
                    }}
                >
                    Đóng
                </p>
            </div>

            <ul className={cx('sidebar-list')} ref={listRef} onScroll={checkScroll}>
                {loading
                    ? Array.from({ length: 6 }).map((_, i) => <li key={i} className={cx('sidebar-item', 'skeleton')} />)
                    : sidebarItems.map((item, index) => {
                          const isSearch = item.type === 'search';
                          const isFixed = item.type === 'fixed';

                          // Icon: search/combo dùng _icon, category dùng ICON_MAP
                          const icon =
                              isSearch || isFixed ? (
                                  <FontAwesomeIcon icon={item._icon} />
                              ) : (
                                  <FontAwesomeIcon icon={resolveIcon(item.icon)} />
                              );

                          return (
                              <li
                                  key={item.slug}
                                  ref={(el) => (itemRefs.current[index] = el)}
                                  className={cx('sidebar-item', { active: active === item.slug })}
                                  onClick={() => {
                                      if (isSearch) {
                                          setOpenSearch(true);
                                          return;
                                      }
                                      isClickingRef.current = true;
                                      scrollToSection(item.slug);
                                      setActive(item.slug);
                                  }}
                              >
                                  <div className={cx('icon')}>{icon}</div>
                                  <p className={cx('title')}>{item.name}</p>
                              </li>
                          );
                      })}
            </ul>
        </div>
    );
}

export default SideBar;
