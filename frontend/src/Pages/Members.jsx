import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Users, 
  Search, 
  Filter,
  Mail, 
  MapPin, 
  Phone,
  ExternalLink,
  Github,
  Linkedin,
  Twitter,
  BookOpen,
  Award,
  Calendar
} from 'lucide-react';
import { usersAPI } from '../services/api';
import { CardSkeleton } from '../components/UI/SkeletonLoader';

const Members = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  // Fetch all members
  const { data: members, isLoading: membersLoading } = useQuery({
    queryKey: ['all-members'],
    queryFn: () => usersAPI.getUsers({ limit: 100 }),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Filter members based on search and filters
  const filteredMembers = members?.data?.data?.filter(member => {
    const matchesSearch = searchTerm === '' || 
      `${member.firstName} ${member.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.researchAreas?.some(area => area.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesRole = selectedRole === 'all' || member.role === selectedRole;
    const matchesDepartment = selectedDepartment === 'all' || member.department === selectedDepartment;
    
    return matchesSearch && matchesRole && matchesDepartment;
  }) || [];

  // Get unique departments and roles for filters
  const departments = members?.data?.data ? [...new Set(members.data.data.map(member => member.department).filter(Boolean))] : [];
  const roles = members?.data?.data ? [...new Set(members.data.data.map(member => member.role).filter(Boolean))] : [];

  // Group members by role
  const groupedMembers = filteredMembers.reduce((acc, member) => {
    const role = member.role || 'other';
    if (!acc[role]) acc[role] = [];
    acc[role].push(member);
    return acc;
  }, {});

  const roleOrder = ['admin', 'professor', 'student', 'visitor', 'other'];
  const roleLabels = {
    admin: 'Lab Directors',
    professor: 'Faculty Members',
    student: 'Students & Researchers',
    visitor: 'Visiting Researchers',
    other: 'Other Members'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Our Team
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Meet the brilliant minds behind DeepMinds Research Lab - faculty, students, 
            and researchers working together to advance AI and machine learning.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by name, email, or research area..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Role Filter */}
            <div>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Roles</option>
                {roles.map(role => (
                  <option key={role} value={role} className="capitalize">
                    {roleLabels[role] || role}
                  </option>
                ))}
              </select>
            </div>

            {/* Department Filter */}
            <div>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredMembers.length} of {members?.data?.data?.length || 0} members
          </div>
        </div>

        {/* Members Grid */}
        {membersLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, index) => (
              <CardSkeleton key={index} />
            ))}
          </div>
        ) : (
          <div className="space-y-12">
            {roleOrder.map(role => {
              const roleMembers = groupedMembers[role];
              if (!roleMembers || roleMembers.length === 0) return null;

              return (
                <div key={role}>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <div className="bg-blue-500 p-2 rounded-lg">
                      <Users className="text-white" size={20} />
                    </div>
                    {roleLabels[role] || role} ({roleMembers.length})
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {roleMembers.map((member) => (
                      <div key={member._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                        {/* Profile Header */}
                        <div className="text-center mb-6">
                          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <span className="text-white text-2xl font-bold">
                              {member.firstName?.[0]}{member.lastName?.[0]}
                            </span>
                          </div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-1">
                            {member.firstName} {member.lastName}
                          </h3>
                          <p className="text-sm text-blue-600 capitalize font-medium mb-2">
                            {member.role}
                          </p>
                          {member.department && (
                            <p className="text-xs text-gray-500 mb-3">{member.department}</p>
                          )}
                        </div>

                        {/* Bio */}
                        {member.bio && (
                          <div className="mb-4">
                            <p className="text-sm text-gray-600 line-clamp-3">{member.bio}</p>
                          </div>
                        )}

                        {/* Research Areas */}
                        {member.researchAreas && member.researchAreas.length > 0 && (
                          <div className="mb-4">
                            <div className="flex items-center gap-2 mb-2">
                              <BookOpen size={14} className="text-gray-500" />
                              <span className="text-xs font-medium text-gray-700">Research Areas</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {member.researchAreas.slice(0, 3).map((area, index) => (
                                <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                                  {area}
                                </span>
                              ))}
                              {member.researchAreas.length > 3 && (
                                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                                  +{member.researchAreas.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Education */}
                        {member.education && member.education.length > 0 && (
                          <div className="mb-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Award size={14} className="text-gray-500" />
                              <span className="text-xs font-medium text-gray-700">Education</span>
                            </div>
                            <div className="space-y-1">
                              {member.education.slice(0, 2).map((edu, index) => (
                                <div key={index} className="text-xs text-gray-600">
                                  <span className="font-medium">{edu.degree}</span>
                                  {edu.institution && <span className="text-gray-500"> - {edu.institution}</span>}
                                  {edu.year && <span className="text-gray-500"> ({edu.year})</span>}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Contact Info */}
                        <div className="border-t border-gray-200 pt-4">
                          <div className="space-y-2 mb-4">
                            {member.email && (
                              <div className="flex items-center gap-2 text-xs text-gray-600">
                                <Mail size={12} />
                                <a href={`mailto:${member.email}`} className="hover:text-blue-600 truncate">
                                  {member.email}
                                </a>
                              </div>
                            )}
                            {member.phone && (
                              <div className="flex items-center gap-2 text-xs text-gray-600">
                                <Phone size={12} />
                                <a href={`tel:${member.phone}`} className="hover:text-blue-600">
                                  {member.phone}
                                </a>
                              </div>
                            )}
                            {member.location && (
                              <div className="flex items-center gap-2 text-xs text-gray-600">
                                <MapPin size={12} />
                                <span>{member.location}</span>
                              </div>
                            )}
                          </div>

                          {/* Social Links */}
                          <div className="flex justify-center space-x-3">
                            {member.socialLinks?.github && (
                              <a 
                                href={member.socialLinks.github} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-gray-400 hover:text-gray-900 transition-colors"
                              >
                                <Github size={16} />
                              </a>
                            )}
                            {member.socialLinks?.linkedin && (
                              <a 
                                href={member.socialLinks.linkedin} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-gray-400 hover:text-blue-600 transition-colors"
                              >
                                <Linkedin size={16} />
                              </a>
                            )}
                            {member.socialLinks?.twitter && (
                              <a 
                                href={member.socialLinks.twitter} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-gray-400 hover:text-blue-400 transition-colors"
                              >
                                <Twitter size={16} />
                              </a>
                            )}
                            {member.website && (
                              <a 
                                href={member.website} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-gray-400 hover:text-green-600 transition-colors"
                              >
                                <ExternalLink size={16} />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!membersLoading && filteredMembers.length === 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No members found</h3>
            <p className="text-gray-600">
              {searchTerm || selectedRole !== 'all' || selectedDepartment !== 'all'
                ? 'Try adjusting your search or filters.'
                : 'No members have been added yet.'}
            </p>
          </div>
        )}

        {/* Join Us Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Join Our Team</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Are you passionate about AI and machine learning research? We're always looking for 
            talented individuals to join our growing team of researchers and innovators.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="mailto:deepminds@must.ac.ug"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors duration-200 flex items-center gap-2"
            >
              <Mail size={20} />
              Contact Us
            </a>
            <a
              href="/about"
              className="bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition-colors duration-200 flex items-center gap-2"
            >
              <ExternalLink size={20} />
              Learn More
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Members;