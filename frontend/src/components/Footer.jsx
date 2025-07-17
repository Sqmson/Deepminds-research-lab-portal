import { Mail, MapPin, Github, ExternalLink } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <AnimatePresence>
      <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
        <style>
          {`
            .footer-gradient {
              background: rgb(85,85,85);
              position: relative;
              overflow: hidden;
            }
      
            .footer-gradient::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background:
                radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(99, 102, 241, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 40% 60%, rgba(16, 185, 129, 0.05) 0%, transparent 50%);
              pointer-events: none;
            }
      
            .footer-link {
              position: relative;
              transition: all 0.3s ease;
              display: inline-block;
            }
      
            .footer-link:hover {
              color: #3b82f6;
              transform: translateY(-2px);
            }
      
            .footer-link::after {
              content: '';
              position: absolute;
              bottom: -2px;
              left: 0;
              width: 0;
              height: 2px;
              background: linear-gradient(90deg, #3b82f6, #6366f1);
              transition: width 0.3s ease;
            }
      
            .footer-link:hover::after {
              width: 100%;
            }
      
            .social-icon {
              transition: all 0.3s ease;
              background: rgba(255, 255, 255, 0.1);
              backdrop-filter: blur(10px);
              border: 1px solid rgba(255, 255, 255, 0.2);
            }
      
            .social-icon:hover {
              background: rgba(59, 130, 246, 0.2);
              border-color: rgba(59, 130, 246, 0.5);
              transform: translateY(-3px) scale(1.1);
              box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
            }
      
            .section-title {
              position: relative;
              display: inline-block;
            }
      
            .section-title::after {
              content: '';
              position: absolute;
              bottom: -4px;
              left: 0;
              width: 40px;
              height: 3px;
              background: linear-gradient(90deg, #3b82f6, #6366f1);
              border-radius: 2px;
            }
      
            .contact-item {
              transition: all 0.3s ease;
              padding: 8px 12px;
              border-radius: 8px;
              border: 1px solid transparent;
            }
      
            .contact-item:hover {
              background: rgba(59, 130, 246, 0.1);
              border-color: rgba(59, 130, 246, 0.3);
              transform: translateX(5px);
            }
      
            .pulse-dot {
              animation: pulse 2s infinite;
            }
      
            @keyframes pulse {
              0%, 100% {
                opacity: 1;
              }
              50% {
                opacity: 0.5;
              }
            }
      
            .footer-bottom {
              border-top: 1px solid rgba(255, 255, 255, 0.1);
              background: rgba(75, 75, 75, 0.8);
              backdrop-filter: blur(10px);
            }
      
            .brand-text {
              background: linear-gradient(45deg, #3b82f6, #6366f1, #8b5cf6);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
              font-weight: 700;
            }
          `}
        </style>
      
        <footer className="footer-gradient text-white mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            
            <div className="flex flex-col lg:flex-row justify-center items-start mb-12">

              {/* About Section */}
              <div className="lg:w-1/2 mb-8 lg:mb-0">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center">
                    {/* <Beaker className="w-6 h-6 text-white" /> */}
                    <img 
                      className='w-10 h-10'
                      src="/logo-7402580_1920.png"
                      alt="Logo"
                     />
                  </div>
                  <div>
                    <h3 className="brand-text text-xl font-bold">DMRLab</h3>
                    <p className="text-xs text-gray-300">Research & Innovation</p>
                  </div>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-4 max-w-md">
                  DeepsMinds ResearchLab is dedicated to advancing machine learning and artificial intelligence research through innovative projects and collaborative Discussions.
                </p>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full pulse-dot"></div>
                  <span>Upstart</span>
                </div>
              </div>

              {/* Social Media Section */}
              <div className="lg:w-auto">
                <h4 className="section-title text-white font-semibold mb-6">Connect With Us</h4>
                <div className="flex space-x-4">
                  <a href="https://github.com/" className="social-icon w-12 h-12 rounded-lg flex items-center justify-center">
                    <Github className="w-6 h-6 text-white" />
                  </a>
                  <a href="#" className="social-icon w-12 h-12 rounded-lg flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </a>
                </div>
              </div>

            </div>

            <div className="flex justify-end">

              <div className="flex flex-col lg:flex-row gap-8 ">
                {/* Research Areas */}
                <div>
                  <h4 className="section-title text-white font-semibold mb-6">Research Focus</h4>
                  <ul className="space-y-3">
                    <li>
                      <span className="text-gray-300 text-sm block">Deep Learning</span>
                      <span className="text-gray-500 text-xs">Neural Networks & AI</span>
                    </li>
                    <li>
                      <span className="text-gray-300 text-sm block">Machine Learning</span>
                      <span className="text-gray-500 text-xs">Algorithms & Models</span>
                    </li>
                    <li>
                      <span className="text-gray-300 text-sm block">Data Science</span>
                      <span className="text-gray-500 text-xs">Analysis & Visualization</span>
                    </li>
                  </ul>
                </div>

                {/* Contact Info */}
                <div>
                  <h4 className="section-title text-white font-semibold mb-6">Get In Touch</h4>
                  <div className="space-y-3">
                    <div className="contact-item">
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 text-blue-400 mr-3" />
                        <div>
                          <p className="text-gray-300 text-sm">contact@dmrlab.org</p>
                          <p className="text-gray-500 text-xs">General inquiries</p>
                        </div>
                      </div>
                    </div>
                    <div className="contact-item">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 text-blue-400 mr-3" />
                        <div>
                          <p className="text-gray-300 text-sm">MUST</p>
                          <p className="text-gray-500 text-xs">Kihumuro Library Discussion Room 2</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Bottom Bar */}
          <div className="footer-bottom">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="text-center">
                <div className="flex flex-col md:flex-row justify-center items-center space-y-2 md:space-y-0 md:space-x-6">
                  <p className="text-gray-400 text-sm">
                    © {currentYear} DeepsMinds Research Lab.
                  </p>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <span>•</span>
                    <span>Version 9.1.0</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </motion.div>
    </AnimatePresence>
  );
};

export default Footer;