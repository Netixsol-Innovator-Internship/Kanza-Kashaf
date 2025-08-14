"use client"

import LoginForm from "../components/LoginForm"
import ThemeToggle from "../components/ThemeToggle"

const LoginPage = ({ onLoginSuccess, onToggleAuth }) => {
  return (
    <div className="login-page">
      <div className="theme-toggle-container">
        <ThemeToggle />
      </div>
      <div className="login-container">
        <h1>Task Manager</h1>
        <LoginForm onLoginSuccess={onLoginSuccess} />
        <p className="auth-switch">
          Don't have an account?{" "}
          <button className="link-button" onClick={onToggleAuth}>
            Sign up here
          </button>
        </p>
      </div>
    </div>
  )
}

export default LoginPage
