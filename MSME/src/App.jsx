import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import { ThemeProvider } from './context/ThemeContext';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import LoginPage from './components/auth/LoginPage';
import SignupPage from './components/auth/SignupPage';

function AppContent() {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route path="/" element={<LandingPage onLaunchDashboard={() => navigate('/dashboard')} />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="*" element={<LandingPage onLaunchDashboard={() => navigate('/dashboard')} />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <DataProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </DataProvider>
    </ThemeProvider>
  );
}
