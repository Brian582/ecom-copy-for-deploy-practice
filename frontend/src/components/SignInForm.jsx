import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function SignInForm({ formData, onChange, onSubmit }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
        <h1 className="signup-title"> Sign In</h1>
        
        <form className="signup-form" onSubmit={onSubmit}>
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
            placeholder="Password"
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

        <button type="submit" className="signup-submit-button">
            Sign In
        </button>
        </form>
    </>
  );
}
