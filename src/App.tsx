import { Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Layout } from './components/Layout';
import Home from './pages/Home';
import Scan from './pages/Scan';
import Detect from './pages/Detect';
import Pantry from './pages/Pantry';
import Recipes from './pages/Recipes';
import Family from './pages/Family';
import Cook from './pages/Cook';
import Health from './pages/Health';

export default function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [location.pathname]);

  // Pages animate in on mount; no exit-wait, so nested presence animations can never block navigation.
  return (
    <Layout>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/scan" element={<Scan />} />
        <Route path="/detect" element={<Detect />} />
        <Route path="/pantry" element={<Pantry />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/family" element={<Family />} />
        <Route path="/cook" element={<Cook />} />
        <Route path="/health" element={<Health />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </Layout>
  );
}
