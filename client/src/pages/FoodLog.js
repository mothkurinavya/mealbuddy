import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function FoodLog() {
  const { token, user } = useAuth();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [log, setLog] = useState([]);
  const [loading, setLoading] = useState(false);

  if (user?.role !== 'premium') {
    return (
      <div style={{ padding: 20, textAlign: 'center', marginTop: 100 }}>
        <h2>🔒 Premium Feature</h2>
        <p>Manual Food Logger is only available for Premium users.</p>
        <a href="/" style={{ color: '#4CAF50' }}>Go Home</a>
      </div>
    );
  }

  const searchFood = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5001/api/foodlog/search?query=${query}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResults(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const addToLog = (food) => {
    setLog([...log, { ...food, time: new Date().toLocaleTimeString() }]);
    setResults([]);
    setQuery('');
  };

  const removeFromLog = (index) => {
    setLog(log.filter((_, i) => i !== index));
  };

  const totals = log.reduce((acc, food) => ({
    calories: acc.calories + (food.calories || 0),
    protein: acc.protein + (food.protein || 0),
    carbs: acc.carbs + (food.carbs || 0),
    fat: acc.fat + (food.fat || 0),
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  return (
    <div style={{ padding: 20, maxWidth: 700, margin: '0 auto' }}>
      <h2>📝 Manual Food Logger</h2>
      <p style={{ color: '#666' }}>Log food items not in your meal plan</p>

      <div style={{ padding: 20, border: '1px solid #ddd', borderRadius: 8, marginBottom: 20 }}>
        <h3>Search Food</h3>
        <div style={{ display: 'flex', gap: 10 }}>
          <input
            placeholder="e.g. banana, chicken breast..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && searchFood()}
            style={{ flex: 1, padding: 8 }}
          />
          <button onClick={searchFood} style={{ padding: '8px 16px', background: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer', borderRadius: 4 }}>
            Search
          </button>
        </div>

        {loading && <p>Searching...</p>}

        {results.length > 0 && (
          <div style={{ marginTop: 10 }}>
            {results.map(food => (
              <div key={food.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #eee' }}>
                <div>
                  <p style={{ margin: 0, fontWeight: 'bold' }}>{food.name}</p>
                  <p style={{ margin: 0, fontSize: 12, color: '#666' }}>
                    🔥 {food.calories}kcal | 🥩 {food.protein}g | 🍞 {food.carbs}g | 🧈 {food.fat}g
                  </p>
                </div>
                <button onClick={() => addToLog(food)} style={{ padding: '4px 12px', background: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer', borderRadius: 4 }}>
                  + Add
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {log.length > 0 && (
        <>
          <div style={{ padding: 15, background: '#f9f9f9', borderRadius: 8, marginBottom: 20 }}>
            <h3>Today's Totals</h3>
            <p>🔥 Calories: {totals.calories.toFixed(0)} kcal</p>
            <p>🥩 Protein: {totals.protein.toFixed(1)}g</p>
            <p>🍞 Carbs: {totals.carbs.toFixed(1)}g</p>
            <p>🧈 Fat: {totals.fat.toFixed(1)}g</p>
          </div>

          <div style={{ padding: 20, border: '1px solid #ddd', borderRadius: 8 }}>
            <h3>Food Log ({log.length} items)</h3>
            {log.map((food, index) => (
              <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #eee' }}>
                <div>
                  <p style={{ margin: 0 }}>{food.name}</p>
                  <p style={{ margin: 0, fontSize: 12, color: '#666' }}>{food.time} — {food.calories}kcal</p>
                </div>
                <button onClick={() => removeFromLog(index)} style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}>
                  Remove
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}