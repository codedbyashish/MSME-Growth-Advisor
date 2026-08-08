import React from 'react';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';

export { LoginPage, SignupPage };

export default function AuthPage({ initialMode = 'login', ...props }) {
  if (initialMode === 'signup') {
    return <SignupPage {...props} />;
  }
  return <LoginPage {...props} />;
}
