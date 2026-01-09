import { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';


export default function SignUpForm({ formData, onChange, onSubmit }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <>
    <h1 className="signup-title">Create Account</h1>
    <p className="signup-subtitle">Join us for an amazing experience</p>

    <form className="signup-form" onSubmit={onSubmit}>
      <div className="signup-input-group">
        <User className="signup-input-icon" />
        <input
          type="text"
          name="Name"
          placeholder="Name"
          className="signup-input"
          value={formData.Name}
          onChange={onChange}
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
          onChange={onChange}
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
          onChange={onChange}
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
          onChange={onChange}
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
    </>
  );
}
