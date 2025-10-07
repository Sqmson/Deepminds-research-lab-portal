import { useState } from 'react';

export default function Login({ onLogin }) {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE || import.meta.env.API_BASE_URL}/deepminds/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user, password: pass })
      });
      let data;
      try { data = await res.json(); } catch (e) { data = null; }
      if (!res.ok) {
        const serverMsg = data && typeof data === 'object' ? JSON.stringify(data) : (data || res.statusText);
        throw new Error(`Server ${res.status}: ${serverMsg}`);
      }
      onLogin(data.token);
    } catch (err) {
      // show the full error message (status + payload when available)
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Admin login</h2>
      <form onSubmit={submit}>
        <label className="block mb-2">Username</label>
        <input className="w-full mb-3 p-2 border" value={user} onChange={e=>setUser(e.target.value)} />
        <label className="block mb-2">Password</label>
        <input type="password" className="w-full mb-3 p-2 border" value={pass} onChange={e=>setPass(e.target.value)} />
        <button className="px-4 py-2 bg-blue-600 text-white rounded" disabled={loading}>{loading? '...' : 'Login'}</button>
  {error && <div className="mt-3 text-red-600 whitespace-pre-wrap">{error}</div>}
      </form>
    </div>
  );
}
