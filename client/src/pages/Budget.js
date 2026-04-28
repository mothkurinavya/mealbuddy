import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Budget() {
  const { token } = useAuth();
  const [budget, setBudget] = useState(null);
  const [limit, setLimit] = useState('');
  const [item, setItem] = useState('');
  const [cost, setCost] = useState('');

  useEffect(() => { fetchBudget(); }, []);

  const fetchBudget = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/budget', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBudget(res.data);
      setLimit(res.data.weeklyLimit);
    } catch (err) {
      console.error(err);
    }
  };

  const setWeeklyLimit = async () => {
    try {
      const res = await axios.put('http://localhost:5001/api/budget/limit',
        { weeklyLimit: Number(limit) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBudget(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addEntry = async () => {
    if (!item || !cost) return;
    try {
      const res = await axios.post('http://localhost:5001/api/budget/entry',
        { item, cost: Number(cost) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBudget(res.data);
      setItem('');
      setCost('');
    } catch (err) {
      console.error(err);
    }
  };

  const deleteEntry = async (id) => {
    try {
      const res = await axios.delete(`http://localhost:5001/api/budget/entry/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBudget(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const totalSpent = budget?.entries?.reduce((sum, e) => sum + e.cost, 0) || 0;
  const remaining = (budget?.weeklyLimit || 0) - totalSpent;
  const percentage = budget?.weeklyLimit ? (totalSpent / budget.weeklyLimit) * 100 : 0;

  return (
    <div style={{ padding: 20, maxWidth: 700, margin: '0 auto' }}>
      <h2>💰 Grocery Budget Tracker</h2>

      <div style={{ marginBottom: 20, padding: 15, border: '1px solid #ddd', borderRadius: 8 }}>
        <h3>Weekly Budget Limit</h3>
        <input
          type="number"
          placeholder="Set weekly limit (€)"
          value={limit}
          onChange={e => setLimit(e.target.value)}
          style={{ padding: 8, width: 200, marginRight: 10 }}
        />
        <button onClick={setWeeklyLimit} style={{ padding: 8, background: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}>
          Set Limit
        </button>
      </div>

      {budget?.weeklyLimit > 0 && (
        <div style={{ marginBottom: 20, padding: 15, border: '1px solid #ddd', borderRadius: 8 }}>
          <h3>Budget Overview</h3>
          <p>Weekly Limit: €{budget.weeklyLimit}</p>
          <p>Total Spent: €{totalSpent.toFixed(2)}</p>
          <p style={{ color: remaining < 0 ? 'red' : 'green' }}>
            Remaining: €{remaining.toFixed(2)}
          </p>
          <div style={{ background: '#f0f0f0', borderRadius: 10, height: 20, marginTop: 10 }}>
            <div style={{
              background: percentage > 100 ? 'red' : percentage > 75 ? 'orange' : '#4CAF50',
              width: `${Math.min(percentage, 100)}%`,
              height: '100%',
              borderRadius: 10,
              transition: 'width 0.3s'
            }} />
          </div>
          <p>{percentage.toFixed(0)}% of budget used</p>
        </div>
      )}

      <div style={{ marginBottom: 20, padding: 15, border: '1px solid #ddd', borderRadius: 8 }}>
        <h3>Add Expense</h3>
        <input
          placeholder="Item name"
          value={item}
          onChange={e => setItem(e.target.value)}
          style={{ padding: 8, width: 200, marginRight: 10 }}
        />
        <input
          type="number"
          placeholder="Cost (€)"
          value={cost}
          onChange={e => setCost(e.target.value)}
          style={{ padding: 8, width: 100, marginRight: 10 }}
        />
        <button onClick={addEntry} style={{ padding: 8, background: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}>
          Add
        </button>
      </div>

      <div style={{ padding: 15, border: '1px solid #ddd', borderRadius: 8 }}>
        <h3>Expenses</h3>
        {budget?.entries?.length === 0 && <p>No expenses yet.</p>}
        {budget?.entries?.map(e => (
          <div key={e._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
            <span>{e.item}</span>
            <span>€{e.cost.toFixed(2)}</span>
            <button onClick={() => deleteEntry(e._id)} style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}>
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}