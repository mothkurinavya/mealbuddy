import { useState } from 'react';
import axios from 'axios';

export default function Recipes() {
  const [query, setQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);

  const searchRecipes = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5001/api/recipes/search?query=${query}`);
      setRecipes(res.data.results);
      setSelected(null);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  if (selected) {
    return (
      <div style={{ padding: 20, maxWidth: 800, margin: '0 auto' }}>
        <button onClick={() => setSelected(null)} style={{ marginBottom: 20, padding: '8px 16px', cursor: 'pointer' }}>
          Back to Recipes
        </button>
        <img src={selected.image} alt={selected.title} style={{ width: '100%', borderRadius: 12 }} />
        <h2>{selected.title}</h2>
        <p>Cost per serving: ${(selected.pricePerServing / 100).toFixed(2)}</p>
        <p>Calories: {selected.nutrition?.nutrients?.find(n => n.name === 'Calories')?.amount?.toFixed(0)} kcal</p>
        <p>Protein: {selected.nutrition?.nutrients?.find(n => n.name === 'Protein')?.amount?.toFixed(1)}g</p>
        <p>Carbs: {selected.nutrition?.nutrients?.find(n => n.name === 'Carbohydrates')?.amount?.toFixed(1)}g</p>
        <p>Fat: {selected.nutrition?.nutrients?.find(n => n.name === 'Fat')?.amount?.toFixed(1)}g</p>
        <h3>Summary</h3>
        <div dangerouslySetInnerHTML={{ __html: selected.summary }} />
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Browse Recipes</h2>
      <div style={{ marginBottom: 20 }}>
        <input
          placeholder="Search recipes..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && searchRecipes()}
          style={{ padding: 10, width: 300, marginRight: 10 }}
        />
        <button onClick={searchRecipes} style={{ padding: 10, background: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}>
          Search
        </button>
      </div>
      {loading && <p>Loading...</p>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
        {recipes.map(recipe => (
          <div
            key={recipe.id}
            onClick={() => setSelected(recipe)}
            style={{ border: '1px solid #ddd', borderRadius: 8, padding: 10, cursor: 'pointer' }}
          >
            <img src={recipe.image} alt={recipe.title} style={{ width: '100%', borderRadius: 8 }} />
            <h4>{recipe.title}</h4>
            <p>${(recipe.pricePerServing / 100).toFixed(2)} per serving</p>
            <p>{recipe.nutrition?.nutrients?.find(n => n.name === 'Calories')?.amount?.toFixed(0)} kcal</p>
            <p style={{ color: '#4CAF50' }}>Click to see full details</p>
          </div>
        ))}
      </div>
    </div>
  );
}