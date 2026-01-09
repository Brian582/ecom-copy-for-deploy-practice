import { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useToast } from '../hooks/useToast';
import '../styles/SignUp.css';

export default function SignUp() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

  return (
    <div className="signup-page">
      <main className="signup-hero">
        <div className="signup-blob signup-blob-1"></div>
        <div className="signup-blob signup-blob-2"></div>

        <div className="signup-content">
          <div className="signup-card">
            <h1 className="signup-title">Create Account</h1>
            <p className="signup-subtitle">Join us for an amazing experience</p>

            <form className="signup-form" onSubmit={handleSubmit}>
              <div className="signup-input-group">
                <User className="signup-input-icon" />
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  className="signup-input"
                  value={formData.fullName}
                  onChange={handleChange}
                  maxLength={100}
                />
              </div>

              <div className="signup-input-group">
                <Mail className="signup-input-icon" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  className="signup-input"
                  value={formData.email}
                  onChange={handleChange}
                  maxLength={255}
                />
              </div>

              <div className="signup-input-group">
                <Lock className="signup-input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Password (min 8 characters)"
                  className="signup-input"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="signup-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>

              <div className="signup-input-group">
                <Lock className="signup-input-icon" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  className="signup-input"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="signup-password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>

              <button type="submit" className="signup-submit-button">
                Create Account
              </button>
            </form>

            <p className="signup-signin-link">
              Already have an account? <Link to="/signup">Sign In</Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
