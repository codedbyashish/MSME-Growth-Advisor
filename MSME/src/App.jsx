import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';

function AppContent() {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route path="/" element={<LandingPage onLaunchDashboard={() => navigate('/dashboard')} />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="*" element={<LandingPage onLaunchDashboard={() => navigate('/dashboard')} />} />
    </Routes>
  );
}

export default function App() {
  return (
    <DataProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </DataProvider>
  );
}
