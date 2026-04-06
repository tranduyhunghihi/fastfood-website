import { Fragment } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { publicRoutes } from './routes';
import DefaultLayout from './Layout/components/DefaultLayout';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    {publicRoutes.map((route, index) => {
                        const Layout = route.layout === null ? Fragment : DefaultLayout;
                        const Page = route.component;

                        const element = (
                            <Layout>
                                <Page />
                            </Layout>
                        );

                        // Route cần đăng nhập thì bọc PrivateRoute
                        const wrappedElement = route.private ? <PrivateRoute>{element}</PrivateRoute> : element;

                        if (route.children) {
                            return (
                                <Route key={index} path={route.path} element={wrappedElement}>
                                    {route.children.map((child, i) => {
                                        if (child.redirect) {
                                            return (
                                                <Route
                                                    key={i}
                                                    index
                                                    path={child.path}
                                                    element={<Navigate to={child.redirect} />}
                                                />
                                            );
                                        }
                                        const ChildPage = child.component;
                                        return <Route key={i} path={child.path} element={<ChildPage />} />;
                                    })}
                                </Route>
                            );
                        }

                        return <Route key={index} path={route.path} element={wrappedElement} />;
                    })}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
