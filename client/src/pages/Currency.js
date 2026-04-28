import { useState } from 'react';
import axios from 'axios';

const CURRENCIES = ['EUR', 'USD', 'GBP', 'INR', 'PKR', 'NGN', 'BRL', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'PHP', 'PLN', 'RON'];

export default function Currency() {
  const [base, setBase] = useState('EUR');
  const [target, setTarget] = useState('USD');
  const [amount, setAmount] = useState('');
  const [result, setResult] = useState(null);
  const [rate, setRate] = useState(null);

  const convert = async () => {
    try {
      const res = await axios.get(`http://localhost:5001/api/currency/pair/${base}/${target}`);
      setRate(res.data.rate);
      setResult((Number(amount) * res.data.rate).toFixed(2));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 500, margin: '0 auto' }}>
      <h2>💱 Currency Converter</h2>
      <p style={{ color: '#666' }}>Convert grocery prices to your home currency</p>

      <div style={{ padding: 20, border: '1px solid #ddd', borderRadius: 8 }}>
        <div style={{ marginBottom: 15 }}>
          <label>Amount</label>
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="Enter amount"
            style={{ display: 'block', width: '100%', padding: 8, marginTop: 5 }}
          />
        </div>

        <div style={{ display: 'flex', gap: 10, marginBottom: 15 }}>
          <div style={{ flex: 1 }}>
            <label>From</label>
            <select value={base} onChange={e => setBase(e.target.value)} style={{ display: 'block', width: '100%', padding: 8, marginTop: 5 }}>
              {CURRENCIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label>To</label>
            <select value={target} onChange={e => setTarget(e.target.value)} style={{ display: 'block', width: '100%', padding: 8, marginTop: 5 }}>
              {CURRENCIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <button onClick={convert} style={{ width: '100%', padding: 10, background: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer', borderRadius: 4 }}>
          Convert
        </button>

        {result && (
          <div style={{ marginTop: 20, padding: 15, background: '#f9f9f9', borderRadius: 8, textAlign: 'center' }}>
            <h3>{amount} {base} = <span style={{ color: '#4CAF50' }}>{result} {target}</span></h3>
            <p style={{ color: '#666' }}>Rate: 1 {base} = {rate} {target}</p>
          </div>
        )}
      </div>
    </div>
  );
}