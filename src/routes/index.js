import Home from '../pages/Home/Home';
import Cart from '../pages/Cart/Cart';
import Profile from '../pages/Profile/Profile';
import MyProfile from '../pages/Profile/MyProfile/MyProfile';
import Notice from '../pages/Profile/Notice/Notice';
import ChangePassword from '../pages/Profile/ChangePassword/ChangePassword';
import SignIn from '../pages/SignIn/SignIn';
import Order from '../pages/Order/Order';

const publicRoutes = [
    { path: '/', component: Home },
    { path: '/cart', component: Cart },
    { path: '/sign-in', component: SignIn },
    { path: '/order-tracking', component: Order },
    {
        path: '/profile',
        component: Profile,
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
