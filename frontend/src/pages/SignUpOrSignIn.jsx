import { useState } from 'react';
import { useToast } from '../hooks/useToast';
import SignUpForm from '../components/SignUpForm';
import SignInForm from '../components/SignInForm';
import '../styles/SignUpOrSignIn.css';


export default function SignUp() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isSignIn, setIsSignIn] = useState(false);
  const [signInData, setSignInData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignInChange = (e) => {
    const { name, value } = e.target;
    setSignInData((prev) => ({ ...prev, [name]: value }));
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { fullName, email, password, confirmPassword } = formData;

    if (!fullName.trim() || !email.trim() || !password || !confirmPassword) {
      toast({
        title: 'Missing Fields',
        description: 'Please fill in all fields.',
        variant: 'destructive',
      });
      return;
    }

    if (fullName.trim().length > 100) {
      toast({
        title: 'Name Too Long',
        description: 'Name must be less than 100 characters.',
        variant: 'destructive',
      });
      return;
    }

    if (!validateEmail(email)) {
      toast({
        title: 'Invalid Email',
        description: 'Please enter a valid email address.',
        variant: 'destructive',
      });
      return;
    }

    if (password.length < 8) {
      toast({
        title: 'Password Too Short',
        description: 'Password must be at least 8 characters.',
        variant: 'destructive',
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: 'Passwords Do Not Match',
        description: 'Please make sure your passwords match.',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Account Created!',
      description: 'Welcome to Golden Dragon! You can now sign in.',
      variant: 'default',
    });

    setFormData({
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
  };

  const handleSignInSubmit = (e) => {
    e.preventDefault();
    const { email, password } = signInData;
    if (!email.trim() || !password) {
      toast({
        title: 'Missing Fields',
        description: 'Please enter your email and password.',
        variant: 'destructive',
      });
      return;
    }

    if (!validateEmail(email)) {
      toast({
        title: 'Invalid Email',
        description: 'Please enter a valid email address.',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Signed In',
      description: 'Welcome back!',
      variant: 'default',
    });

    setSignInData({ email: '', password: '' });
  };

  return (
    
    <div className="signup-page">
      <main className="signup-hero">
        <div className="signup-blob signup-blob-1"></div>
        <div className="signup-blob signup-blob-2"></div>

        <div className="signup-content">
          <div className="signup-card">

            {isSignIn ? (
              <SignInForm
                formData={signInData}
                onChange={handleSignInChange}
                onSubmit={handleSignInSubmit}
              />
            ) : (
              <SignUpForm
                formData={formData}
                onChange={handleChange}
                onSubmit={handleSubmit}
              />
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