import React, { useState } from 'react';
import { 
  Bell, 
  Users, 
  BookOpen, 
  Calendar, 
  Star, 
  TrendingUp, 
  ArrowRight,
  Play,
  Eye,
  MessageCircle,
  Award,
  Clock,
  ChevronRight
} from 'lucide-react';

// Welcome Hero Component
const WelcomeHero = () => {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '60px 20px',
      textAlign: 'center',
      borderRadius: '12px',
      marginBottom: '30px'
    }}>
      <h1 style={{
        fontSize: '2.5rem',
        fontWeight: '700',
        margin: '0 0 15px 0',
        textShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        Welcome to DMRLab
      </h1>
      <p style={{
        fontSize: '1.1rem',
        opacity: '0.9',
        maxWidth: '600px',
        margin: '0 auto 25px auto',
        lineHeight: '1.6'
      }}>
        Your gateway to cutting-edge research, collaboration, and innovation in AI and machine learning
      </p>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '15px',
        flexWrap: 'wrap'
      }}>
        <button style={{
          backgroundColor: 'rgba(255,255,255,0.2)',
          border: '1px solid rgba(255,255,255,0.3)',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '8px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          transition: 'all 0.2s ease'
        }}>
          <Play size={16} />
          Get Started
        </button>
        <button style={{
          backgroundColor: 'transparent',
          border: '1px solid rgba(255,255,255,0.5)',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '8px',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}>
          Learn More
        </button>
      </div>
    </div>
  );
};

// Quick Stats Component
const QuickStats = () => {
  const stats = [
    { label: 'Active Projects', value: '24', icon: BookOpen, color: '#3b82f6' },
    { label: 'Lab Members', value: '67', icon: Users, color: '#10b981' },
    { label: 'Publications', value: '156', icon: Award, color: '#f59e0b' },
    { label: 'Events This Month', value: '8', icon: Calendar, color: '#8b5cf6' }
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '15px',
      marginBottom: '30px'
    }}>
      {stats.map((stat, index) => (
        <div key={index} style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '10px',
          border: '1px solid #e5e7eb',
          textAlign: 'center',
          transition: 'all 0.2s ease',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}>
          <div style={{
            backgroundColor: stat.color,
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px auto'
          }}>
            <stat.icon size={24} color="white" />
          </div>
          <div style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: '#1f2937',
            margin: '0 0 5px 0'
          }}>
            {stat.value}
          </div>
          <div style={{
            fontSize: '0.9rem',
            color: '#6b7280'
          }}>
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
};

// Announcements Card
const AnnouncementsCard = () => {
  const announcements = [
    {
      title: "New AI Research Grant Approved",
      date: "2 days ago",
      priority: "high",
      excerpt: "We've secured funding for our next breakthrough project..."
    },
    {
      title: "Monthly Lab Meeting - Friday 2PM",
      date: "5 days ago",
      priority: "medium",
      excerpt: "Join us for project updates and collaborative discussions..."
    },
    {
      title: "Welcome New Research Assistant",
      date: "1 week ago",
      priority: "low",
      excerpt: "Please welcome Sarah Chen to our growing team..."
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
            Latest Announcements
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

// Featured Projects Component
const FeaturedProjects = () => {
  const projects = [
    {
      title: "Neural Network Optimization",
      description: "Advanced algorithms for deep learning efficiency",
      progress: 85,
      members: 8,
      status: "Active",
      image: "🧠"
    },
    {
      title: "Computer Vision Pipeline",
      description: "Real-time object detection and recognition",
      progress: 60,
      members: 12,
      status: "Active",
      image: "👁️"
    },
    {
      title: "Natural Language Processing",
      description: "Sentiment analysis and text classification",
      progress: 40,
      members: 6,
      status: "Planning",
      image: "💬"
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
          <Star size={20} color="#f59e0b" />
          <h3 style={{
            margin: 0,
            fontSize: '1.1rem',
            fontWeight: '600',
            color: '#1f2937'
          }}>
            Featured Projects
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
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px'
        }}>
          {projects.map((project, index) => (
            <div key={index} style={{
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '16px',
              transition: 'all 0.2s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '12px'
              }}>
                <div style={{
                  fontSize: '2rem',
                  lineHeight: 1
                }}>
                  {project.image}
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{
                    margin: '0 0 4px 0',
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: '#1f2937'
                  }}>
                    {project.title}
                  </h4>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    fontSize: '0.8rem',
                    color: '#6b7280'
                  }}>
                    <span style={{
                      backgroundColor: project.status === 'Active' ? '#dcfce7' : '#fef3c7',
                      color: project.status === 'Active' ? '#16a34a' : '#d97706',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '0.75rem'
                    }}>
                      {project.status}
                    </span>
                    <span style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <Users size={12} />
                      {project.members}
                    </span>
                  </div>
                </div>
              </div>
              <p style={{
                margin: '0 0 12px 0',
                fontSize: '0.9rem',
                color: '#4b5563',
                lineHeight: '1.4'
              }}>
                {project.description}
              </p>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.8rem',
                color: '#6b7280'
              }}>
                <span>Progress:</span>
                <div style={{
                  flex: 1,
                  backgroundColor: '#f3f4f6',
                  height: '6px',
                  borderRadius: '3px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${project.progress}%`,
                    height: '100%',
                    backgroundColor: '#3b82f6',
                    transition: 'width 0.3s ease'
                  }}></div>
                </div>
                <span>{project.progress}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Quick Navigation Component
const QuickNavigation = () => {
  const navItems = [
    { title: 'Research Articles', icon: BookOpen, color: '#3b82f6', count: '24 new' },
    { title: 'Lab Members', icon: Users, color: '#10b981', count: '67 total' },
    { title: 'Upcoming Events', icon: Calendar, color: '#f59e0b', count: '8 this month' },
    { title: 'Publications', icon: Award, color: '#8b5cf6', count: '156 total' }
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

// Main Lobby Component
const Lobby = () => {
  return (
    <div style={{
      backgroundColor: '#f8fafc',
      minHeight: '100vh',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <WelcomeHero />
        <QuickStats />
        <QuickNavigation />
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '30px',
          marginBottom: '30px'
        }}>
          <AnnouncementsCard />
          <FeaturedProjects />
        </div>
      </div>
    </div>
  );
};

export default Lobby;