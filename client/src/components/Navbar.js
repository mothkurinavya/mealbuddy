import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <a href="/">🍽️ MealBuddy</a>
      </div>
      <div className="navbar-links">
        {user ? (
          <>
            <a href="/recipes">Recipes</a>
            <a href="/mealplan">Meal Plan</a>
            <a href="/budget">Budget</a>
            <a href="/currency">Currency</a>
            <a href="/profile">Profile</a>
            {user.role === 'premium' && <>
              <a href="/nutrition">Nutrition</a>
              <a href="/bmr">BMR</a>
              <a href="/foodlog">Food Log</a>
            </>}
            {user.role !== 'premium' && (
              <a href="/upgrade" className="upgrade-btn">⭐ Upgrade</a>
            )}
            <div className="user-info">
              <span>🪙 {user.coins}</span>
              <span>🔥 {user.streak}</span>
              <span className={`role-badge ${user.role}`}>{user.role}</span>
            </div>
            <button onClick={logout} className="logout-btn">Logout</button>
          </>
        ) : (
          <>
            <a href="/login">Login</a>
            <a href="/register" className="register-btn">Register</a>
          </>
        )}
      </div>
    </nav>
  );
}