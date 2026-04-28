import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function MealPlan() {
  const { token } = useAuth();
  const [meals, setMeals] = useState([]);
  const [query, setQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [selectedDay, setSelectedDay] = useState('Monday');

  useEffect(() => {
    fetchMealPlan();
  }, []);

  const fetchMealPlan = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/mealplan', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMeals(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const searchRecipes = async () => {
    try {
      const res = await axios.get(`http://localhost:5001/api/recipes/search?query=${query}`);
      setRecipes(res.data.results);
    } catch (err) {
      console.error(err);
    }
  };

  const addMeal = async (recipe) => {
    try {
      await axios.post('http://localhost:5001/api/mealplan', {
        day: selectedDay,
        recipeId: recipe.id,
        title: recipe.title,
        image: recipe.image,
        pricePerServing: recipe.pricePerServing,
        nutrition: recipe.nutrition
      }, { headers: { Authorization: `Bearer ${token}` } });
      fetchMealPlan();
      setRecipes([]);
      setQuery('');
    } catch (err) {
      console.error(err);
    }
  };

  const deleteMeal = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/mealplan/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchMealPlan();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>📅 Weekly Meal Plan</h2>

      <div style={{ marginBottom: 20 }}>
        <select value={selectedDay} onChange={e => setSelectedDay(e.target.value)} style={{ padding: 8, marginRight: 10 }}>
          {DAYS.map(d => <option key={d}>{d}</option>)}
        </select>
        <input
          placeholder="Search recipe to add..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{ padding: 8, width: 250, marginRight: 10 }}
        />
        <button onClick={searchRecipes} style={{ padding: 8, background: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}>
          Search
        </button>
      </div>

      {recipes.length > 0 && (
        <div style={{ marginBottom: 20, border: '1px solid #ddd', padding: 10, borderRadius: 8 }}>
          <h4>Select a recipe to add to {selectedDay}:</h4>
          {recipes.slice(0, 5).map(r => (
            <div key={r.id} style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
              <img src={r.image} alt={r.title} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4, marginRight: 10 }} />
              <span style={{ flex: 1 }}>{r.title}</span>
              <button onClick={() => addMeal(r)} style={{ padding: '4px 12px', background: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer', borderRadius: 4 }}>
                + Add
              </button>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 10 }}>
        {DAYS.map(day => (
          <div key={day} style={{ border: '1px solid #ddd', borderRadius: 8, padding: 10, minHeight: 200 }}>
            <h4 style={{ textAlign: 'center', background: '#4CAF50', color: 'white', margin: -10, padding: 8, borderRadius: '8px 8px 0 0' }}>{day}</h4>
            <div style={{ marginTop: 10 }}>
              {meals.filter(m => m.day === day).map(meal => (
                <div key={meal._id} style={{ marginBottom: 8, fontSize: 12 }}>
                  <img src={meal.image} alt={meal.title} style={{ width: '100%', borderRadius: 4 }} />
                  <p style={{ margin: '4px 0' }}>{meal.title}</p>
                  <button onClick={() => deleteMeal(meal._id)} style={{ fontSize: 10, color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}>
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}