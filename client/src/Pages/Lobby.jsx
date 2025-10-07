import QuickNavigation from '../components/Lobby/QuickNavigation';
import Announcements from '../components/Lobby/AnnouncementStrip';

const Lobby = () => {
  return (
    <div style={{
      backgroundColor: '#f8fafc',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <QuickNavigation />
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '30px',
          marginBottom: '30px'
        }}>
          <Announcements />
        </div>
      </div>
    </div>
  );
};

export default Lobby;
