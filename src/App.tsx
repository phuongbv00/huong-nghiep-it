import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Privacy from './pages/Privacy';
import Quiz from './pages/Quiz';
import Result from './pages/Result';
import RoleDetail from './pages/RoleDetail';
import Roles from './pages/Roles';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/trac-nghiem" element={<Quiz />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/ket-qua" element={<Result />} />
          <Route path="/vai-tro" element={<Roles />} />
          <Route path="/vai-tro/:id" element={<RoleDetail />} />
          <Route path="/quyen-rieng-tu" element={<Privacy />} />
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </>
  );
}
