import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
// @ts-ignore
import MotionFlow from '@slicemypage/motionflow';
import { MainLayout } from './layout/MainLayout';
import { Home } from './pages/Home';
import { Pricing } from './pages/Pricing';
import { Changelog } from './pages/Changelog';
import { Roadmap } from './pages/Roadmap';
import { Blog } from './pages/Blog';
import { BlogDetail } from './pages/BlogDetail';
import { Privacy } from './pages/Privacy';
import { Terms } from './pages/Terms';
import { Contact } from './pages/Contact';
import { Documentation } from './pages/Documentation';



function App() {
  useEffect(() => {
    // Initialize MotionFlow for ticker/animations
    if (typeof MotionFlow === 'function') {
      MotionFlow();
    } else if (MotionFlow && typeof MotionFlow.init === 'function') {
      MotionFlow.init();
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="changelog" element={<Changelog />} />
          <Route path="roadmap" element={<Roadmap />} />
          <Route path="blog" element={<Blog />} />
          <Route path="blog/:slug" element={<BlogDetail />} />
          <Route path="documentation" element={<Documentation />} />
          <Route path="contact" element={<Contact />} />
          <Route path="terms" element={<Terms />} />
          <Route path="privacy" element={<Privacy />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
