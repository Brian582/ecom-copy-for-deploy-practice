import { useState, useContext } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useToast } from '../hooks/useToast';
import { AuthContext } from '../Context.jsx';

export default function SignInForm() {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { signIn }  = useContext(AuthContext);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, password } = formData;
    if (!email.trim() || !password) {
      toast({ title: 'Missing Fields', description: 'Please enter your email and password.', variant: 'destructive' });
      return;
    }

    if (!validateEmail(email)) {
      toast({ title: 'Invalid Email', description: 'Please enter a valid email address.', variant: 'destructive' });
      return;
    }

    signIn(formData) //signs in user if their input is valid
    toast({ title: 'Signed In', description: 'Welcome back!', variant: 'default' });//greets user with pop up message
    setFormData({ email: '', password: '' });//resets form's fields

  };

  return (
    <>
      <h1 className="signup-title"> Sign In</h1>

      <form className="signup-form" onSubmit={handleSubmit}>
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
            placeholder="Password"
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

        <button type="submit" className="signup-submit-button">
          Sign In
        </button>
      </form>
    </>
  );
}
