import { useState } from 'react';
import Login from './Login.jsx';
import AdminArticles from './AdminArticles.jsx';

export default function AdminPanel() {
  const [token, setToken] = useState(null);

  if (!token) return <Login onLogin={setToken} />;

  return (
    <div className="py-6">
      <AdminArticles token={token} />
    </div>
  );
}
