import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

export default function PaymentSuccess() {
  const { user, token, logout } = useAuth();

  useEffect(() => {
    const upgradeUser = async () => {
      try {
        // Upgrade user to premium
        await axios.put('http://localhost:5001/api/auth/upgrade',
          { email: user?.email },
        );
      } catch (err) {
        console.error(err);
      }
      // Logout and redirect to login to refresh token
      setTimeout(() => {
        logout();
        window.location.href = '/login';
      }, 3000);
    };
    upgradeUser();
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: 100, padding: 20 }}>
      <h1>🎉 Payment Successful!</h1>
      <p style={{ fontSize: 20, color: '#4CAF50' }}>Welcome to MealBuddy Premium!</p>
      <p>You now have access to all premium features.</p>
      <p style={{ color: '#666' }}>Redirecting you to login in a few seconds...</p>
      <div style={{ marginTop: 20 }}>
        <a href="/login" style={{ padding: '10px 20px', background: '#4CAF50', color: 'white', textDecoration: 'none', borderRadius: 4 }}>
          Login Now
        </a>
      </div>
    </div>
  );
}