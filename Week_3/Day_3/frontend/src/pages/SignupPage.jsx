"use client"

import SignupForm from "../components/SignupForm"
import ThemeToggle from "../components/ThemeToggle"

const SignupPage = ({ onSignupSuccess, onToggleAuth }) => {
  return (
    <div className="signup-page">
      <div className="theme-toggle-container">
        <ThemeToggle />
      </div>
      <div className="signup-container">
        <h1>Create Account</h1>
        <SignupForm onSignupSuccess={onSignupSuccess} />
        <p className="auth-switch">
          Already have an account?{" "}
          <button className="link-button" onClick={onToggleAuth}>
            Login here
          </button>
        </p>
      </div>
    </div>
  )
}

export default SignupPage
