import { Fragment } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { publicRoutes } from './routes';
import DefaultLayout from './Layout/components/DefaultLayout';

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    {publicRoutes.map((route, index) => {
                        const Layout = route.layout === null ? Fragment : DefaultLayout;
                        const Page = route.component;
                        if (route.children) {
                            return (
                                <Route
                                    key={index}
                                    path={route.path}
                                    element={
                                        <Layout>
                                            <Page />
                                        </Layout>
                                    }
                                >
                                    {route.children.map((child, index) => {
                                        if (child.redirect) {
                                            return (
                                                <Route
                                                    key={index}
                                                    index
                                                    path={child.path}
                                                    element={<Navigate to={child.redirect} />}
                                                />
                                            );
                                        }
                                        const ChildPage = child.component;
                                        return <Route key={index} path={child.path} element={<ChildPage />} />;
                                    })}
                                </Route>
                            );
                        }
                        return (
                            <Route
                                path={route.path}
                                element={
                                    <Layout>
                                        <Page />
                                    </Layout>
                                }
                            />
                        );
                    })}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
