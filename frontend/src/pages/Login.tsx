import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [captchaExpected, setCaptchaExpected] = useState(0);
  const [captchaText, setCaptchaText] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    generateCaptcha();
  }, []);

  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    setCaptchaText(`${num1} + ${num2}`);
    setCaptchaExpected(num1 + num2);
    setCaptchaAnswer('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (parseInt(captchaAnswer) !== captchaExpected) {
      setError('Invalid CAPTCHA answer');
      generateCaptcha();
      return;
    }
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="card auth-card">
        <h2>CorpDesk Login</h2>
        {error && <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div className="input-group">
            <label>Security Check: What is {captchaText}?</label>
            <input type="number" value={captchaAnswer} onChange={(e) => setCaptchaAnswer(e.target.value)} required placeholder="Answer" />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            Login
          </button>
        </form>

        <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
          <p style={{ textAlign: 'center', fontSize: '0.875rem', marginBottom: '1rem', color: 'var(--text-muted)' }}>Or quick login as:</p>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
            <button 
              className="btn btn-outline" 
              style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
              onClick={() => { setEmail('admin@corp.com'); setPassword('password123'); }}
            >
              Admin
            </button>
            <button 
              className="btn btn-outline" 
              style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
              onClick={() => { setEmail('agent@corp.com'); setPassword('password123'); }}
            >
              Agent
            </button>
            <button 
              className="btn btn-outline" 
              style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
              onClick={() => { setEmail('john@corp.com'); setPassword('password123'); }}
            >
              Employee
            </button>
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem' }}>
          Don't have an account? <Link to="/signup" style={{ color: 'var(--primary)', fontWeight: '600' }}>Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
