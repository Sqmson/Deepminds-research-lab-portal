import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Users, 
  Target, 
  Award, 
  BookOpen, 
  Mail, 
  MapPin, 
  Phone,
  ExternalLink,
  Github,
  Linkedin,
  Twitter
} from 'lucide-react';
import { usersAPI } from '../services/api';
import { CardSkeleton } from '../components/UI/SkeletonLoader';
import { Link } from 'react-router-dom';

const About = () => {
  // Fetch team members
  const { data: members, isLoading: membersLoading } = useQuery({
    queryKey: ['team-members'],
    queryFn: () => usersAPI.getUsers({ role: ['admin', 'professor', 'student'], limit: 20 }),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const labInfo = {
    mission: "To advance the frontiers of Machine Learning and Artificial Intelligence through cutting-edge research, innovative solutions, and academic excellence.",
    vision: "To be a leading research laboratory in East Africa, contributing to global AI knowledge while addressing local technological challenges.",
    objectives: [
      "Conduct world-class research in Machine Learning and AI",
      "Train the next generation of AI researchers and practitioners",
      "Develop AI solutions for real-world problems in Uganda and East Africa",
      "Foster collaboration between academia and industry",
      "Promote ethical AI development and deployment"
    ],
    researchAreas: [
      {
        title: "Machine Learning",
        description: "Deep learning, neural networks, and advanced ML algorithms",
        icon: BookOpen
      },
      {
        title: "Computer Vision",
        description: "Image processing, object detection, and visual recognition systems",
        icon: Target
      },
      {
        title: "Natural Language Processing",
        description: "Text analysis, language models, and conversational AI",
        icon: Users
      },
      {
        title: "AI for Social Good",
        description: "Applying AI to healthcare, agriculture, and education in Africa",
        icon: Award
      }
    ]
  };

  const contactInfo = {
    address: "Mbarara University of Science and Technology, Faculty of Computing and Informatics, Mbarara, Uganda",
    email: "deepminds@must.ac.ug",
    phone: "+256 485 420 782"
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About DeepMinds Research Lab
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            A premier research laboratory at Mbarara University of Science and Technology, 
            dedicated to advancing artificial intelligence and machine learning research 
            in Uganda and East Africa.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center mb-6">
              <div className="bg-blue-500 p-3 rounded-lg mr-4">
                <Target className="text-white" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Our Mission</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              {labInfo.mission}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center mb-6">
              <div className="bg-green-500 p-3 rounded-lg mr-4">
                <Award className="text-white" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Our Vision</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              {labInfo.vision}
            </p>
          </div>
        </div>

        {/* Objectives */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Objectives</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {labInfo.objectives.map((objective, index) => (
              <div key={index} className="flex items-start">
                <div className="bg-blue-100 text-blue-600 rounded-full p-1 mr-3 mt-1 flex-shrink-0">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                </div>
                <p className="text-gray-700">{objective}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Research Areas */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Research Areas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {labInfo.researchAreas.map((area, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
                <div className="bg-purple-500 p-3 rounded-lg mb-4 w-fit">
                  <area.icon className="text-white" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{area.title}</h3>
                <p className="text-gray-600 text-sm">{area.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team Members */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Team</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Meet the dedicated researchers, faculty, and students who make our lab a center of excellence in AI research.
            </p>
          </div>

          {membersLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <CardSkeleton key={index} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {members?.data?.data?.map((member) => (
                <div key={member._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
                  <div className="text-center mb-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <span className="text-white text-xl font-bold">
                        {member.firstName?.[0]}{member.lastName?.[0]}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {member.firstName} {member.lastName}
                    </h3>
                    <p className="text-sm text-gray-600 capitalize mb-2">{member.role}</p>
                    {member.department && (
                      <p className="text-xs text-gray-500">{member.department}</p>
                    )}
                  </div>

                  {member.researchAreas && member.researchAreas.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-medium text-gray-700 mb-2">Research Areas:</p>
                      <div className="flex flex-wrap gap-1">
                        {member.researchAreas.slice(0, 2).map((area, index) => (
                          <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                            {area}
                          </span>
                        ))}
                        {member.researchAreas.length > 2 && (
                          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                            +{member.researchAreas.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-center space-x-3">
                    {member.email && (
                      <a href={`mailto:${member.email}`} className="text-gray-400 hover:text-blue-600 transition-colors">
                        <Mail size={16} />
                      </a>
                    )}
                    {member.socialLinks?.github && (
                      <a href={member.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-900 transition-colors">
                        <Github size={16} />
                      </a>
                    )}
                    {member.socialLinks?.linkedin && (
                      <a href={member.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors">
                        <Linkedin size={16} />
                      </a>
                    )}
                    {member.socialLinks?.twitter && (
                      <a href={member.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">
                        <Twitter size={16} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Link
              to="/members"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <Users size={20} />
              View All Members
            </Link>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Contact Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-500 p-3 rounded-lg w-fit mx-auto mb-4">
                <MapPin className="text-white" size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Address</h3>
              <p className="text-gray-600 text-sm">{contactInfo.address}</p>
            </div>

            <div className="text-center">
              <div className="bg-green-500 p-3 rounded-lg w-fit mx-auto mb-4">
                <Mail className="text-white" size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
              <a href={`mailto:${contactInfo.email}`} className="text-blue-600 hover:text-blue-700 text-sm">
                {contactInfo.email}
              </a>
            </div>

            <div className="text-center">
              <div className="bg-purple-500 p-3 rounded-lg w-fit mx-auto mb-4">
                <Phone className="text-white" size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Phone</h3>
              <a href={`tel:${contactInfo.phone}`} className="text-blue-600 hover:text-blue-700 text-sm">
                {contactInfo.phone}
              </a>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200 text-center">
            <p className="text-gray-600 mb-4">
              Interested in collaborating or joining our research team?
            </p>
            <a
              href={`mailto:${contactInfo.email}`}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <Mail size={20} />
              Get in Touch
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;