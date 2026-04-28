import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function BMR() {
  const { user } = useAuth();
  const [form, setForm] = useState({ age: '', weight: '', height: '', gender: 'female', activity: '1.55' });
  const [result, setResult] = useState(null);

  if (user?.role !== 'premium') {
    return (
      <div style={{ padding: 20, textAlign: 'center', marginTop: 100 }}>
        <h2>🔒 Premium Feature</h2>
        <p>BMR Calculator is only available for Premium users.</p>
        <a href="/" style={{ color: '#4CAF50' }}>Go Home</a>
      </div>
    );
  }

  const calculate = () => {
    const { age, weight, height, gender, activity } = form;
    let bmr;
    if (gender === 'male') {
      bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
      bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }
    const tdee = bmr * parseFloat(activity);
    setResult({ bmr: bmr.toFixed(0), tdee: tdee.toFixed(0) });
  };

  const activityLevels = [
    { value: '1.2', label: 'Sedentary (little/no exercise)' },
    { value: '1.375', label: 'Lightly active (1-3 days/week)' },
    { value: '1.55', label: 'Moderately active (3-5 days/week)' },
    { value: '1.725', label: 'Very active (6-7 days/week)' },
    { value: '1.9', label: 'Extra active (physical job)' },
  ];

  return (
    <div style={{ padding: 20, maxWidth: 500, margin: '0 auto' }}>
      <h2>⚡ BMR Calculator</h2>
      <p style={{ color: '#666' }}>Calculate your Basal Metabolic Rate and daily calorie needs</p>

      <div style={{ padding: 20, border: '1px solid #ddd', borderRadius: 8 }}>
        <div style={{ marginBottom: 15 }}>
          <label>Gender</label>
          <select value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })} style={{ display: 'block', width: '100%', padding: 8, marginTop: 5 }}>
            <option value="female">Female</option>
            <option value="male">Male</option>
          </select>
        </div>

        <div style={{ marginBottom: 15 }}>
          <label>Age (years)</label>
          <input type="number" placeholder="e.g. 21" value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} style={{ display: 'block', width: '100%', padding: 8, marginTop: 5 }} />
        </div>

        <div style={{ marginBottom: 15 }}>
          <label>Weight (kg)</label>
          <input type="number" placeholder="e.g. 60" value={form.weight} onChange={e => setForm({ ...form, weight: e.target.value })} style={{ display: 'block', width: '100%', padding: 8, marginTop: 5 }} />
        </div>

        <div style={{ marginBottom: 15 }}>
          <label>Height (cm)</label>
          <input type="number" placeholder="e.g. 165" value={form.height} onChange={e => setForm({ ...form, height: e.target.value })} style={{ display: 'block', width: '100%', padding: 8, marginTop: 5 }} />
        </div>

        <div style={{ marginBottom: 15 }}>
          <label>Activity Level</label>
          <select value={form.activity} onChange={e => setForm({ ...form, activity: e.target.value })} style={{ display: 'block', width: '100%', padding: 8, marginTop: 5 }}>
            {activityLevels.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
          </select>
        </div>

        <button onClick={calculate} style={{ width: '100%', padding: 10, background: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer', borderRadius: 4 }}>
          Calculate
        </button>

        {result && (
          <div style={{ marginTop: 20, padding: 15, background: '#f9f9f9', borderRadius: 8 }}>
            <h3>Your Results:</h3>
            <p>🔥 <strong>BMR:</strong> {result.bmr} calories/day</p>
            <p>⚡ <strong>Daily Calorie Need (TDEE):</strong> {result.tdee} calories/day</p>
            <hr />
            <p style={{ fontSize: 12, color: '#666' }}>BMR = calories your body needs at rest</p>
            <p style={{ fontSize: 12, color: '#666' }}>TDEE = total daily calories based on activity</p>
          </div>
        )}
      </div>
    </div>
  );
}