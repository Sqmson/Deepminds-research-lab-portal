import {
  Bell,
  Clock,
  ChevronRight
} from 'lucide-react';

const Announcements = () => {
  const announcements = [
    {
      title: "Monthly Lab Meeting - Friday 2PM",
      date: "5 days ago",
      priority: "medium",
      excerpt: "Join us for updates and collaborative discussions..."
    },
    {
      title: "Welcome New Research Assistant",
      date: "1 week ago",
      priority: "low",
      excerpt: "Please welcome samson to our growing team..."
    }
  ];

  return (
    <div style={{
      backgroundColor: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
      overflow: 'hidden'
    }}>
      <div style={{
        backgroundColor: '#f8fafc',
        padding: '16px 20px',
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Bell size={20} color="#3b82f6" />
          <h3 style={{
            margin: 0,
            fontSize: '1.1rem',
            fontWeight: '600',
            color: '#1f2937'
          }}>
            Announcements
          </h3>
        </div>
        <button style={{
          backgroundColor: 'transparent',
          border: 'none',
          color: '#3b82f6',
          cursor: 'pointer',
          fontSize: '0.9rem',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          View All
          <ChevronRight size={16} />
        </button>
      </div>
      <div style={{ padding: '20px' }}>
        {announcements.map((announcement, index) => (
          <div key={index} style={{
            paddingBottom: '16px',
            marginBottom: '16px',
            borderBottom: index < announcements.length - 1 ? '1px solid #f3f4f6' : 'none'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px'
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: announcement.priority === 'high' ? '#ef4444' :
                  announcement.priority === 'medium' ? '#f59e0b' : '#10b981',
                marginTop: '6px',
                flexShrink: 0
              }}></div>
              <div style={{ flex: 1 }}>
                <h4 style={{
                  margin: '0 0 4px 0',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  color: '#1f2937'
                }}>
                  {announcement.title}
                </h4>
                <p style={{
                  margin: '0 0 6px 0',
                  fontSize: '0.85rem',
                  color: '#6b7280',
                  lineHeight: '1.4'
                }}>
                  {announcement.excerpt}
                </p>
                <div style={{
                  fontSize: '0.8rem',
                  color: '#9ca3af',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <Clock size={12} />
                  {announcement.date}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Announcements