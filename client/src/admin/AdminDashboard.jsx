import { useState, useEffect } from 'react';
import {
  LayoutDashboard, FileText, Bell, Users, Info,
  Settings, LogOut, Plus, Edit, Trash2, Search,
  Menu, X, ChevronDown, Save, XCircle
} from 'lucide-react';
import AdminArticles from './AdminArticles.jsx';
import { connectSocket } from '../utils/socket';

export default function AdminDashboard({ token }) {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [currentEntity, setCurrentEntity] = useState(null);

  useEffect(() => {
    console.log('Modal state changed - showModal:', showModal, 'modalMode:', modalMode, 'currentEntity:', currentEntity);
  }, [showModal, modalMode, currentEntity]);
  const [searchTerm, setSearchTerm] = useState('');

  // Data from server
  const [announcements, setAnnouncements] = useState([]);
  const [members, setMembers] = useState([]);
  const [footerElements, setFooterElements] = useState([]);
  const [aboutContent, setAboutContent] = useState({});
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigation = [
    { name: 'Dashboard', icon: LayoutDashboard, section: 'dashboard' },
    { name: 'Articles', icon: FileText, section: 'articles' },
    { name: 'Announcements', icon: Bell, section: 'announcements' },
    { name: 'Members', icon: Users, section: 'members' },
    { name: 'Footer Elements', icon: Settings, section: 'footer' },
    { name: 'About Us', icon: Info, section: 'about' }
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const base = import.meta.env.VITE_API_BASE || import.meta.env.API_BASE_URL;
        console.log('API Base URL:', base);
        console.log('VITE_API_BASE:', import.meta.env.VITE_API_BASE);
        console.log('API_BASE_URL:', import.meta.env.API_BASE_URL);
        const headers = { 'Authorization': `Bearer ${token}` };
        const [annRes, memRes, aboutRes, artRes] = await Promise.all([
          fetch(`${base}/admin/announcements`, { headers }),
          fetch(`${base}/admin/members`, { headers }),
          fetch(`${base}/admin/about`, { headers }),
          fetch(`${base}/articles`)
        ]);
        setAnnouncements(await annRes.json());
        setMembers(await memRes.json());
        setFooterElements(await aboutRes.json()); // assuming about is footer
        setAboutContent(await aboutRes.json()[0] || {}); // first about
        setArticles(await artRes.json());
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  useEffect(() => {
    const socket = connectSocket();
    const onAnnCreated = (ann) => setAnnouncements(prev => [...prev, ann]);
    const onAnnUpdated = (ann) => setAnnouncements(prev => prev.map(a => a._id === ann._id ? ann : a));
    const onAnnDeleted = ({ id }) => setAnnouncements(prev => prev.filter(a => a._id !== id));
    const onMemCreated = (mem) => setMembers(prev => [...prev, mem]);
    const onMemUpdated = (mem) => setMembers(prev => prev.map(m => m._id === mem._id ? mem : m));
    const onMemDeleted = ({ id }) => setMembers(prev => prev.filter(m => m._id !== id));
    const onAboutCreated = (ab) => setFooterElements(prev => [...prev, ab]);
    const onAboutUpdated = (ab) => setFooterElements(prev => prev.map(f => f._id === ab._id ? ab : f));
    const onAboutDeleted = ({ id }) => setFooterElements(prev => prev.filter(f => f._id !== id));
    const onArtCreated = (art) => setArticles(prev => [art, ...prev]);
    const onArtUpdated = (art) => setArticles(prev => prev.map(a => a._id === art._id ? art : a));
    const onArtDeleted = ({ id }) => setArticles(prev => prev.filter(a => a._id !== id));

    socket.on('announcement:created', onAnnCreated);
    socket.on('announcement:updated', onAnnUpdated);
    socket.on('announcement:deleted', onAnnDeleted);
    socket.on('member:created', onMemCreated);
    socket.on('member:updated', onMemUpdated);
    socket.on('member:deleted', onMemDeleted);
    socket.on('about:created', onAboutCreated);
    socket.on('about:updated', onAboutUpdated);
    socket.on('about:deleted', onAboutDeleted);
    socket.on('article:created', onArtCreated);
    socket.on('article:updated', onArtUpdated);
    socket.on('article:deleted', onArtDeleted);

    return () => {
      socket.off('announcement:created', onAnnCreated);
      socket.off('announcement:updated', onAnnUpdated);
      socket.off('announcement:deleted', onAnnDeleted);
      socket.off('member:created', onMemCreated);
      socket.off('member:updated', onMemUpdated);
      socket.off('member:deleted', onMemDeleted);
      socket.off('about:created', onAboutCreated);
      socket.off('about:updated', onAboutUpdated);
      socket.off('about:deleted', onAboutDeleted);
      socket.off('article:created', onArtCreated);
      socket.off('article:updated', onArtUpdated);
      socket.off('article:deleted', onArtDeleted);
    };
  }, []);

  const handleCreate = (section) => {
    console.log('Opening create modal for section:', section);
    setModalMode('create');
    setCurrentEntity(null);
    setShowModal(true);
    setActiveSection(section);
  };

  const handleEdit = (item) => {
    console.log('Opening edit modal for item:', item);
    setModalMode('edit');
    setCurrentEntity(item);
    setShowModal(true);
  };

  const handleDelete = (section, id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      switch(section) {
        case 'announcements':
          setAnnouncements(announcements.filter(a => a._id !== id));
          break;
        case 'members':
          setMembers(members.filter(m => m._id !== id));
          break;
        case 'footer':
          setFooterElements(footerElements.filter(f => f._id !== id));
          break;
      }
    }
  };

  const DashboardOverview = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Articles', count: articles.length, color: 'blue' },
          { label: 'Announcements', count: announcements.length, color: 'green' },
          { label: 'Team Members', count: members.length, color: 'purple' },
          { label: 'Footer Links', count: footerElements.length, color: 'orange' }
        ].map((stat, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-600">
            <div className="text-sm font-medium text-gray-600">{stat.label}</div>
            <div className="text-3xl font-bold text-gray-900 mt-2">{stat.count}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {[
              'Article "AI in Healthcare" published',
              'New member added: John Doe',
              'Announcement "Lab Closure" created',
              'Footer link updated'
            ].map((activity, idx) => (
              <div key={idx} className="flex items-center text-sm">
                <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                <span className="text-gray-700">{activity}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-2">
            {['Create Article', 'Add Announcement', 'Add Team Member', 'Edit About Us'].map((action, idx) => (
              <button key={idx} onClick={() => handleCreate(action.toLowerCase().split(' ')[1])} className="w-full text-left px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg text-blue-700 font-medium transition-colors">{action}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const ContentTable = ({ data, columns, onEdit, onDelete, section }) => (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{col}</th>
              ))}
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.length === 0 ? (
              <tr><td colSpan={columns.length + 1} className="px-6 py-4 text-center text-gray-500">No items found</td></tr>
            ) : (
              data.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  {Object.keys(item).filter(k => k !== '_id').map((key, i) => (
                    <td key={i} className="px-6 py-4 text-sm text-gray-900">{item[key]}</td>
                  ))}
                  <td className="px-6 py-4 text-right text-sm space-x-2">
                    <button onClick={() => onEdit(item)} className="text-blue-600 hover:text-blue-800 inline-flex items-center"><Edit className="w-4 h-4 mr-1"/>Edit</button>
                    <button onClick={() => onDelete(section, item._id)} className="text-red-600 hover:text-red-800 inline-flex items-center"><Trash2 className="w-4 h-4 mr-1"/>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderContent = () => {
    switch(activeSection) {
      case 'dashboard': return <DashboardOverview />;
      case 'articles': return <AdminArticles token={token} />;
      case 'announcements': return (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Announcements</h2>
            <button onClick={() => handleCreate('announcements')} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"><Plus className="w-4 h-4 mr-2"/>Add Announcement</button>
          </div>
          <ContentTable data={announcements} columns={["title","body","date"]} onEdit={handleEdit} onDelete={handleDelete} section="announcements" />
        </div>
      );
      case 'members': return (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Team Members</h2>
            <button onClick={() => handleCreate('members')} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"><Plus className="w-4 h-4 mr-2"/>Add Member</button>
          </div>
          <ContentTable data={members} columns={["name","role","bio"]} onEdit={handleEdit} onDelete={handleDelete} section="members" />
        </div>
      );
      case 'footer': return (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Footer Elements</h2>
            <button onClick={() => handleCreate('footer')} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"><Plus className="w-4 h-4 mr-2"/>Add Link</button>
          </div>
          <ContentTable data={footerElements} columns={["title","content","updatedAt"]} onEdit={handleEdit} onDelete={handleDelete} section="footer" />
        </div>
      );
      case 'about': return (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">About Us Content</h2>
          <div className="bg-white rounded-lg shadow p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mission Statement</label>
              <textarea value={aboutContent.mission} onChange={(e)=>setAboutContent({...aboutContent, mission: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" rows="4" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Vision</label>
              <textarea value={aboutContent.vision} onChange={(e)=>setAboutContent({...aboutContent, vision: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" rows="4" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">History</label>
              <textarea value={aboutContent.history} onChange={(e)=>setAboutContent({...aboutContent, history: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" rows="4" />
            </div>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center"><Save className="w-4 h-4 mr-2"/>Save Changes</button>
          </div>
        </div>
      );
      default: return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation Bar */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-600 hover:text-gray-900 lg:hidden">{sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}</button>
            <h1 className="text-xl font-bold text-blue-600">DmdLab Admin</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block">
              <input type="text" placeholder="Search..." value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64" />
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
            </div>
            <button className="text-gray-600 hover:text-gray-900"><Bell className="w-6 h-6" /></button>
            <div className="flex items-center space-x-2"><div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">A</div><ChevronDown className="w-4 h-4 text-gray-600" /></div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out mt-[57px] lg:mt-0`}>
          <nav className="p-4 space-y-1 h-full overflow-y-auto">
            {navigation.map((item) => (
              <button key={item.section} onClick={() => { setActiveSection(item.section); if (window.innerWidth < 1024) setSidebarOpen(false); }} className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${activeSection === item.section ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}>
                <div className="flex items-center space-x-3"><item.icon className="w-5 h-5" /><span>{item.name}</span></div>
                {item.count !== undefined && (<span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs font-semibold">{item.count}</span>)}
              </button>
            ))}
            <div className="pt-4 mt-4 border-t border-gray-200">
              <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"><Settings className="w-5 h-5" /><span>Settings</span></button>
              <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"><LogOut className="w-5 h-5" /><span>Logout</span></button>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">{renderContent()}</main>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)}></div>}
    </div>
  );
}
