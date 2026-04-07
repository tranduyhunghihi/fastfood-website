import Home from '../pages/Home/Home';
import Cart from '../pages/Cart/Cart';
import Profile from '../pages/Profile/Profile';
import MyProfile from '../pages/Profile/MyProfile/MyProfile';
import Notice from '../pages/Profile/Notice/Notice';
import ChangePassword from '../pages/Profile/ChangePassword/ChangePassword';
import SignIn from '../pages/SignIn/SignIn';
import Order from '../pages/Order/Order';
import ProductDetail from '../pages/ProductDetail/ProductDetail';
import ComboDetail from '../pages/ComboDetail/ComboDetail';
import Support from '../pages/Support/Support';
import News from '../pages/News/News';
import NewsDetail from '../pages/News/NewsDetail';
import VnpayReturn from '../pages/VnpayReturn/VnpayReturn';

const publicRoutes = [
    { path: '/', component: Home },
    { path: '/cart', component: Cart },
    { path: '/sign-in', component: SignIn },
    { path: '/order-tracking', component: Order },
    { path: '/vnpay-return', component: VnpayReturn },
    { path: '/products/:slug', component: ProductDetail },
    { path: '/combos/:slug', component: ComboDetail },
    { path: '/support', component: Support },
    { path: '/news', component: News },
    { path: '/news/:slug', component: NewsDetail },
    {
        path: '/profile',
        component: Profile,
        private: true,
        children: [
            { index: true, redirect: 'myprofile' },
            { path: 'myprofile', component: MyProfile },
            { path: 'notice', component: Notice },
            { path: 'change-password', component: ChangePassword },
        ],
    },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
