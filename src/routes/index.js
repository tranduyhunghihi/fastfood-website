import Home from '../pages/Home/Home';
import Cart from '../pages/Cart/Cart';

const publicRoutes = [
    { path: '/', component: Home },
    { path: '/cart', component: Cart },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
