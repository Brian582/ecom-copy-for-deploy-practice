import { useState } from 'react';
import SignUpForm from '../components/SignUpForm';
import SignInForm from '../components/SignInForm';
import '../styles/SignUpOrSignIn.css';


export default function SignUpOrSignIn() {
  const [isSignIn, setIsSignIn] = useState(true);

  return (
    <div className="signup-page">
      <main className="signup-hero">
        <div className="signup-blob signup-blob-1"></div>
        <div className="signup-blob signup-blob-2"></div>

        <div className="signup-content">
          <div className="signup-card">

            {isSignIn ? (
              <SignInForm />
            ) : (
              <SignUpForm />
            )}

            <p className="signup-signin-link">
              {isSignIn ? (
                <>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    className="signup-link-button"
                    onClick={() => setIsSignIn(false)}
                  >
                    Create Account
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button
                    type="button"
                    className="signup-link-button"
                    onClick={() => setIsSignIn(true)}
                  >
                    Sign In
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}