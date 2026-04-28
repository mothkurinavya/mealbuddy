import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Nutrition() {
  const { token, user } = useAuth();
  const [meals, setMeals] = useState([]);
  const [goals, setGoals] = useState({ calories: 2000, protein: 50, carbs: 250, fat: 65 });
  const [editGoals, setEditGoals] = useState(false);

  useEffect(() => {
    fetchMeals();
  }, []);

  const fetchMeals = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/mealplan', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMeals(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (user?.role !== 'premium') {
    return (
      <div style={{ padding: 20, textAlign: 'center', marginTop: 100 }}>
        <h2>🔒 Premium Feature</h2>
        <p>The Nutrition Dashboard is only available for Premium users.</p>
        <a href="/upgrade" style={{ padding: '10px 20px', background: '#4CAF50', color: 'white', textDecoration: 'none', borderRadius: 4 }}>
          Upgrade to Premium
        </a>
      </div>
    );
  }

  const getNutrient = (meal, name) => {
    return meal.nutrition?.nutrients?.find(n => n.name === name)?.amount || 0;
  };

  const totals = meals.reduce((acc, meal) => ({
    calories: acc.calories + getNutrient(meal, 'Calories'),
    protein: acc.protein + getNutrient(meal, 'Protein'),
    carbs: acc.carbs + getNutrient(meal, 'Carbohydrates'),
    fat: acc.fat + getNutrient(meal, 'Fat'),
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  const NutrientBar = ({ label, current, goal, unit, color }) => {
    const pct = Math.min((current / goal) * 100, 100);
    return (
      <div style={{ marginBottom: 15 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>{label}</span>
          <span>{current.toFixed(1)}{unit} / {goal}{unit}</span>
        </div>
        <div style={{ background: '#f0f0f0', borderRadius: 10, height: 16, marginTop: 4 }}>
          <div style={{ background: color, width: `${pct}%`, height: '100%', borderRadius: 10 }} />
        </div>
        <p style={{ fontSize: 12, color: '#666' }}>{pct.toFixed(0)}% of daily goal</p>
      </div>
    );
  };

  return (
    <div style={{ padding: 20, maxWidth: 700, margin: '0 auto' }}>
      <h2>📊 Nutrition Dashboard</h2>

      <div style={{ padding: 20, border: '1px solid #ddd', borderRadius: 8, marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>Weekly Nutrition Summary</h3>
          <button onClick={() => setEditGoals(!editGoals)} style={{ padding: '6px 12px', cursor: 'pointer' }}>
            {editGoals ? 'Save Goals' : 'Edit Goals'}
          </button>
        </div>

        {editGoals && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 15 }}>
            {['calories', 'protein', 'carbs', 'fat'].map(key => (
              <div key={key}>
                <label style={{ textTransform: 'capitalize' }}>{key} goal</label>
                <input
                  type="number"
                  value={goals[key]}
                  onChange={e => setGoals({ ...goals, [key]: Number(e.target.value) })}
                  style={{ display: 'block', width: '100%', padding: 6, marginTop: 4 }}
                />
              </div>
            ))}
          </div>
        )}

        <NutrientBar label="🔥 Calories" current={totals.calories} goal={goals.calories} unit="kcal" color="#FF6B6B" />
        <NutrientBar label="🥩 Protein" current={totals.protein} goal={goals.protein} unit="g" color="#4ECDC4" />
        <NutrientBar label="🍞 Carbs" current={totals.carbs} goal={goals.carbs} unit="g" color="#FFE66D" />
        <NutrientBar label="🧈 Fat" current={totals.fat} goal={goals.fat} unit="g" color="#A8E6CF" />
      </div>

      <div style={{ padding: 20, border: '1px solid #ddd', borderRadius: 8 }}>
        <h3>Meals This Week ({meals.length} meals planned)</h3>
        {meals.map(meal => (
          <div key={meal._id} style={{ display: 'flex', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #eee' }}>
            <img src={meal.image} alt={meal.title} style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4, marginRight: 10 }} />
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontWeight: 'bold' }}>{meal.title}</p>
              <p style={{ margin: 0, fontSize: 12, color: '#666' }}>{meal.day}</p>
            </div>
            <div style={{ fontSize: 12, textAlign: 'right' }}>
              <p style={{ margin: 0 }}>🔥 {getNutrient(meal, 'Calories').toFixed(0)} kcal</p>
              <p style={{ margin: 0 }}>🥩 {getNutrient(meal, 'Protein').toFixed(1)}g protein</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}