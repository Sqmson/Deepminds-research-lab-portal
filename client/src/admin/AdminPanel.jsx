import { useState } from 'react';
import Login from './Login.jsx';
import AdminArticles from './AdminArticles.jsx';
import AdminVideos from './AdminVideos.jsx';

// export default function AdminPanel() {
//   const [token, setToken] = useState(null);

//   if (!token) return <Login onLogin={setToken} />;

//   return (
//     <div className="py-6">
//       <AdminArticles token={token} />
//     </div>
//   );
// }

export default function AdminPanel() {
  const [token, setToken] = useState(null);
  const [tab, setTab] = useState('articles');

  if (!token) return <Login onLogin={setToken} />;

  return (
    <div className="py-6">
      <div className="flex gap-4 mb-6 justify-center">
        <button onClick={()=>setTab('articles')} className={tab==='articles' ? 'font-bold' : ''}>Articles</button>
        <button onClick={()=>setTab('videos')} className={tab==='videos' ? 'font-bold' : ''}>Videos</button>
      </div>

      {tab === 'articles' && <AdminArticles token={token} />}
      {tab === 'videos' && <AdminVideos token={token} />}
    </div>
  );
}
