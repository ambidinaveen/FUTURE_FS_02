import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext.jsx';
import Spinner from '../components/Spinner.jsx';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@minicrm.com');
  const [password, setPassword] = useState('Admin@12345');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      toast.success('Welcome back, admin.');
      navigate('/dashboard');
    } catch (error) {
      const message = error?.response?.data?.message || 'Unable to log in';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-orb auth-orb--one" />
      <div className="auth-orb auth-orb--two" />
      <section className="auth-panel glass-card">
        <div className="auth-panel__hero">
          <p className="eyebrow">Lead management, simplified</p>
          <h1>Admin access for a polished mini CRM.</h1>
          <p>
            Track every lead, move opportunities through the pipeline, and keep follow-up notes in one secure dashboard.
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            <span>Email</span>
            <input
              className="input"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@company.com"
              autoComplete="email"
              required
            />
          </label>

          <label>
            <span>Password</span>
            <input
              className="input"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
          </label>

          <button className="button button--primary button--full" type="submit" disabled={loading}>
            {loading ? <Spinner label="Signing in" /> : 'Sign in to dashboard'}
          </button>
        </form>
      </section>
    </div>
  );
};

export default LoginPage;
