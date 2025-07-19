import { Mail, MapPin, Github } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{
      backgroundColor: '#f8f9fa',
      borderTop: '1px solid #e9ecef',
      marginTop: 'auto',
      color: '#6c757d',
      fontSize: '14px',
      lineHeight: '1.5'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 20px 20px 20px'
      }}>
        
        {/* Main Footer Content */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '30px',
          marginBottom: '30px'
        }}>
          
          {/* About Section */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '15px'
            }}>
              <img 
                src="/logo-7402580_1920.png"
                alt="DMRLab Logo"
                style={{
                  width: '32px',
                  height: '32px',
                  marginRight: '10px'
                }}
              />
              <div>
                <h3 style={{
                  margin: 0,
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#343a40'
                }}>
                  DMRLab
                </h3>
                <p style={{
                  margin: 0,
                  fontSize: '12px',
                  color: '#6c757d'
                }}>
                  Research & Innovation
                </p>
              </div>
            </div>
            <p style={{
              margin: '0 0 15px 0',
              maxWidth: '300px',
              color: '#6c757d'
            }}>
              DeepsMinds ResearchLab is dedicated to advancing machine learning and artificial intelligence research through innovative projects and collaborative discussions.
            </p>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: '12px',
              color: '#28a745'
            }}>
              <span style={{
                width: '8px',
                height: '8px',
                backgroundColor: '#28a745',
                borderRadius: '50%',
                marginRight: '8px'
              }}></span>
              Active
            </div>
          </div>

          {/* Research Areas */}
          <div>
            <h4 style={{
              margin: '0 0 15px 0',
              fontSize: '16px',
              fontWeight: '600',
              color: '#343a40'
            }}>
              Research Focus
            </h4>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0
            }}>
              <li style={{ marginBottom: '10px' }}>
                <div style={{ color: '#495057', fontWeight: '500' }}>Deep Learning</div>
                <div style={{ fontSize: '12px', color: '#6c757d' }}>Neural Networks & AI</div>
              </li>
              <li style={{ marginBottom: '10px' }}>
                <div style={{ color: '#495057', fontWeight: '500' }}>Machine Learning</div>
                <div style={{ fontSize: '12px', color: '#6c757d' }}>Algorithms & Models</div>
              </li>
              <li style={{ marginBottom: '10px' }}>
                <div style={{ color: '#495057', fontWeight: '500' }}>Data Science</div>
                <div style={{ fontSize: '12px', color: '#6c757d' }}>Analysis & Visualization</div>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 style={{
              margin: '0 0 15px 0',
              fontSize: '16px',
              fontWeight: '600',
              color: '#343a40'
            }}>
              Contact
            </h4>
            <div style={{ marginBottom: '15px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                marginBottom: '10px'
              }}>
                <Mail style={{
                  width: '16px',
                  height: '16px',
                  marginRight: '8px',
                  marginTop: '2px',
                  color: '#6c757d'
                }} />
                <div>
                  <div style={{ color: '#495057' }}>contact@dmrlab.org</div>
                  <div style={{ fontSize: '12px', color: '#6c757d' }}>General inquiries</div>
                </div>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'flex-start'
              }}>
                <MapPin style={{
                  width: '16px',
                  height: '16px',
                  marginRight: '8px',
                  marginTop: '2px',
                  color: '#6c757d'
                }} />
                <div>
                  <div style={{ color: '#495057' }}>MUST</div>
                  <div style={{ fontSize: '12px', color: '#6c757d' }}>Kihumuro Library Discussion Room 2</div>
                </div>
              </div>
            </div>
            
            {/* Social Links */}
            <div style={{
              display: 'flex',
              gap: '10px'
            }}>
              <a 
                href="https://github.com/" 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '36px',
                  height: '36px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #dee2e6',
                  borderRadius: '6px',
                  color: '#6c757d',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#f8f9fa';
                  e.target.style.borderColor = '#adb5bd';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#ffffff';
                  e.target.style.borderColor = '#dee2e6';
                }}
              >
                <Github style={{ width: '18px', height: '18px' }} />
              </a>
              <a 
                href="mailto:contact@dmrlab.org" 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '36px',
                  height: '36px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #dee2e6',
                  borderRadius: '6px',
                  color: '#6c757d',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#f8f9fa';
                  e.target.style.borderColor = '#adb5bd';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#ffffff';
                  e.target.style.borderColor = '#dee2e6';
                }}
              >
                <Mail style={{ width: '18px', height: '18px' }} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid #e9ecef',
          paddingTop: '20px',
          textAlign: 'center'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'window.innerWidth < 768 ? column : row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '15px',
            flexWrap: 'wrap'
          }}>
            <div style={{
              fontSize: '13px',
              color: '#6c757d'
            }}>
              © {currentYear} DeepsMinds Research Lab. All rights reserved.
            </div>
            <div style={{
              fontSize: '12px',
              color: '#adb5bd'
            }}>
              Version 9.1.0
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;