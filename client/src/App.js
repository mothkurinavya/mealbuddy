import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Recipes from './pages/Recipes';
import MealPlan from './pages/MealPlan';
import Budget from './pages/Budget';
import Currency from './pages/Currency';
import Nutrition from './pages/Nutrition';
import BMR from './pages/BMR';
import Profile from './pages/Profile';
import FoodLog from './pages/FoodLog';
import Upgrade from './pages/Upgrade';
import PaymentSuccess from './pages/PaymentSuccess';

function Home() {
  const { user } = useAuth();
  return (
    <div>
      <div style={{ background: 'linear-gradient(135deg, #2d6a4f, #40916c)', color: 'white', padding: '80px 20px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 48, margin: 0 }}>🍽️ MealBuddy</h1>
        <p style={{ fontSize: 20, marginTop: 10 }}>Budget-aware meal planning for university students</p>
        {!user && (
          <div style={{ marginTop: 30 }}>
            <a href="/register" style={{ padding: '12px 30px', background: 'white', color: '#2d6a4f', textDecoration: 'none', borderRadius: 25, fontWeight: 'bold', marginRight: 15 }}>Get Started Free</a>
            <a href="/login" style={{ padding: '12px 30px', background: 'transparent', color: 'white', textDecoration: 'none', borderRadius: 25, border: '2px solid white' }}>Login</a>
          </div>
        )}
        {user && <p style={{ marginTop: 20, fontSize: 18 }}>Welcome back, {user.name}! 🪙 {user.coins} coins | 🔥 {user.streak} day streak</p>}
      </div>
      <div style={{ padding: '40px 20px', maxWidth: 1000, margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', marginBottom: 30 }}>Everything you need to eat well on a budget</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {[
            { icon: '🍲', title: 'Browse Recipes', desc: 'Search thousands of recipes with cost per serving', link: '/recipes' },
            { icon: '📅', title: 'Meal Planning', desc: 'Plan your weekly meals with a visual calendar', link: '/mealplan' },
            { icon: '💰', title: 'Budget Tracker', desc: 'Track grocery spending with visual progress bar', link: '/budget' },
            { icon: '💱', title: 'Currency Converter', desc: 'Convert prices to your home currency', link: '/currency' },
            { icon: '📊', title: 'Nutrition Dashboard', desc: 'Track daily nutrition intake (Premium)', link: '/nutrition' },
            { icon: '🪙', title: 'Coin Rewards', desc: 'Earn coins daily and unlock free premium', link: '/profile' },
          ].map(feature => (
            <a key={feature.title} href={feature.link} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ padding: 20, border: '1px solid #ddd', borderRadius: 12, textAlign: 'center', cursor: 'pointer' }}
                onMouseOver={e => e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)'}
                onMouseOut={e => e.currentTarget.style.boxShadow = 'none'}>
                <div style={{ fontSize: 40 }}>{feature.icon}</div>
                <h3 style={{ margin: '10px 0 5px' }}>{feature.title}</h3>
                <p style={{ color: '#666', fontSize: 14, margin: 0 }}>{feature.desc}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/mealplan" element={<MealPlan />} />
          <Route path="/budget" element={<Budget />} />
          <Route path="/currency" element={<Currency />} />
          <Route path="/nutrition" element={<Nutrition />} />
          <Route path="/bmr" element={<BMR />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/foodlog" element={<FoodLog />} />
          <Route path="/upgrade" element={<Upgrade />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}