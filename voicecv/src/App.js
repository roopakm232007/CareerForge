import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Interview from './pages/Interview';
import Resume from './pages/Resume';
import SkillGap from './pages/SkillGap';
import JobMatcher from './pages/JobMatcher';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"           element={<Home />} />
        <Route path="/interview"  element={<Interview />} />
        <Route path="/resume"     element={<Resume />} />
        <Route path="/skill-gap"  element={<SkillGap />} />
        <Route path="/jobs"       element={<JobMatcher />} />
      </Routes>
    </BrowserRouter>
  );
}