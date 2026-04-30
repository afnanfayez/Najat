'use client';

import React, { useState } from 'react';
import LoginView from './LoginView';
import LoginSuccess from './LoginSuccess';
import LoginError from './LoginError';
import ForgotPassword from './ForgotPassword';
import EnterCode from './EnterCode';
import ResetPassword from './ResetPassword';

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isForgot, setIsForgot] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleForgotClick = () => {
    setIsForgot(true);
    setIsError(false);
    setIsSuccess(false);
    setIsCodeSent(false);
    setIsResetting(false);
  };

  const handleLoginAttempt = (inputEmail, inputPassword) => {
    const isEmailValid = inputEmail.includes('@');
    const isPasswordValid = inputPassword.length >= 8;

    if (isEmailValid && isPasswordValid) {
      setIsSuccess(true);
      setIsError(false);
      setEmailError(false);
      setPasswordError(false);
    } else {
      setEmailError(!isEmailValid);
      setPasswordError(!isPasswordValid);
      setIsError(true);
      setIsSuccess(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLoginAttempt(email, password);
  };

  if (isSuccess) return <LoginSuccess />;
  
  if (isResetting) {
    return <ResetPassword onLogin={() => {
      setIsResetting(false);
      setIsCodeSent(false);
      setIsForgot(false);
    }} />;
  }

  if (isCodeSent) {
    return <EnterCode 
      onBack={() => setIsCodeSent(false)} 
      onSubmit={(code) => setIsResetting(true)}
    />;
  }

  if (isForgot) {
    return <ForgotPassword 
      onBack={() => setIsForgot(false)} 
      onSubmit={(submittedEmail) => setIsCodeSent(true)}
    />;
  }

  if (isError) {
    return (
      <LoginError 
        initialEmail={email} 
        initialPassword={password}
        emailError={emailError} 
        passwordError={passwordError}
        onLogin={(newEmail, newPassword) => {
          setEmail(newEmail);
          setPassword(newPassword);
          handleLoginAttempt(newEmail, newPassword);
        }}
        onForgot={handleForgotClick}
      />
    );
  }

  return (
    <LoginView
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      showPassword={showPassword}
      setShowPassword={setShowPassword}
      onSubmit={handleSubmit}
      onForgot={handleForgotClick}
    />
  );
};

export default LoginForm;
