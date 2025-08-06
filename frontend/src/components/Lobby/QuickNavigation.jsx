import { 
  BookOpen, 
  Calendar,  
  ArrowRight,
  Award,
} from 'lucide-react';

const QuickNavigation = () => {
  const navItems = [
    { title: 'Articles', icon: BookOpen, color: '#3b82f6', count: '24 new' },
    { title: 'Upcoming Events', icon: Calendar, color: '#f59e0b', count: '8 this month' },
    { title: 'Videos', icon: Award, color: '#8b5cf6', count: '156 total' }
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '15px',
      marginBottom: '30px'
    }}>
      {navItems.map((item, index) => (
        <div key={index} style={{
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '20px',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          gap: '15px'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
          e.currentTarget.style.borderColor = item.color;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
          e.currentTarget.style.borderColor = '#e5e7eb';
        }}>
          <div style={{
            backgroundColor: item.color,
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <item.icon size={24} color="white" />
          </div>
          <div>
            <h4 style={{
              margin: '0 0 4px 0',
              fontSize: '1rem',
              fontWeight: '600',
              color: '#1f2937'
            }}>
              {item.title}
            </h4>
            <p style={{
              margin: 0,
              fontSize: '0.85rem',
              color: '#6b7280'
            }}>
              {item.count}
            </p>
          </div>
          <ArrowRight size={20} color="#9ca3af" style={{ marginLeft: 'auto' }} />
        </div>
      ))}
    </div>
  );
};

export default QuickNavigation;