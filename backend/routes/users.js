const express = require('express');
const User = require('../models/User');
const { auth, adminOnly, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users
// @desc    Get all users with filtering
// @access  Public (limited info) / Private (full info for admin)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      role,
      researchArea,
      position,
      department,
      page = 1,
      limit = 20,
      search,
      sortBy = 'lastName',
      sortOrder = 'asc'
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    let query = { isActive: true };

    // Add filters
    if (role && role !== 'all') query.role = role;
    if (researchArea && researchArea !== 'all') query.researchAreas = researchArea;
    if (position && position !== 'all') query.position = position;
    if (department && department !== 'all') query.department = department;

    let users;
    let total;

    if (search) {
      // Text search on name and bio
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { bio: searchRegex },
        { email: searchRegex }
      ];
    }

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Select fields based on user role
    let selectFields = 'firstName lastName position avatar bio researchAreas department officeLocation website linkedIn googleScholar orcid createdAt';
    
    if (req.user && req.user.role === 'admin') {
      selectFields += ' email phoneNumber lastLogin isEmailVerified';
    }

    users = await User.find(query)
      .select(selectFields)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    total = await User.countDocuments(query);
    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      success: true,
      data: users,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalUsers: total,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1,
        limit: parseInt(limit)
      },
      filters: {
        roles: await User.distinct('role', { isActive: true }),
        positions: await User.distinct('position', { isActive: true }),
        researchAreas: await User.distinct('researchAreas', { isActive: true }),
        departments: await User.distinct('department', { isActive: true })
      }
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch users',
      message: error.message
    });
  }
});

// @route   GET /api/users/faculty
// @desc    Get faculty members
// @access  Public
router.get('/faculty', async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    
    const faculty = await User.getFacultyMembers().limit(parseInt(limit));

    res.json({
      success: true,
      data: faculty
    });

  } catch (error) {
    console.error('Error fetching faculty:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch faculty members',
      message: error.message
    });
  }
});

// @route   GET /api/users/students
// @desc    Get students
// @access  Public
router.get('/students', async (req, res) => {
  try {
    const { 
      program,
      academicYear,
      limit = 20,
      page = 1
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    let query = { 
      role: 'student', 
      isActive: true 
    };

    if (program && program !== 'all') query.program = program;
    if (academicYear && academicYear !== 'all') query.academicYear = academicYear;

    const students = await User.find(query)
      .select('firstName lastName position avatar bio researchAreas program academicYear studentId createdAt')
      .sort({ academicYear: -1, lastName: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);
    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      success: true,
      data: students,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalStudents: total,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1,
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch students',
      message: error.message
    });
  }
});

// @route   GET /api/users/research-area/:area
// @desc    Get users by research area
// @access  Public
router.get('/research-area/:area', async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    
    const users = await User.findByResearchArea(req.params.area).limit(parseInt(limit));

    res.json({
      success: true,
      data: users
    });

  } catch (error) {
    console.error('Error fetching users by research area:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch users by research area',
      message: error.message
    });
  }
});

// @route   GET /api/users/stats
// @desc    Get user statistics
// @access  Public
router.get('/stats', async (req, res) => {
  try {
    const stats = await User.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          totalFaculty: {
            $sum: {
              $cond: [{ $in: ['$role', ['admin', 'professor']] }, 1, 0]
            }
          },
          totalStudents: {
            $sum: {
              $cond: [{ $eq: ['$role', 'student'] }, 1, 0]
            }
          }
        }
      }
    ]);

    // Get users by role
    const usersByRole = await User.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Get users by position
    const usersByPosition = await User.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$position',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Get top research areas
    const topResearchAreas = await User.aggregate([
      { $match: { isActive: true } },
      { $unwind: '$researchAreas' },
      {
        $group: {
          _id: '$researchAreas',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      data: {
        overview: stats[0] || {
          totalUsers: 0,
          totalFaculty: 0,
          totalStudents: 0
        },
        usersByRole,
        usersByPosition,
        topResearchAreas
      }
    });

  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user statistics',
      message: error.message
    });
  }
});

// @route   GET /api/users/:id
// @desc    Get single user profile
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('firstName lastName position avatar bio researchAreas department officeLocation website linkedIn googleScholar orcid publications createdAt');

    if (!user || !user.isActive) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });

  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user',
      message: error.message
    });
  }
});

// @route   PUT /api/users/:id
// @desc    Update user (admin only)
// @access  Admin only
router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      position,
      role,
      researchAreas,
      department,
      isActive,
      isEmailVerified
    } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Update allowed fields
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (position) user.position = position;
    if (role) user.role = role;
    if (researchAreas) user.researchAreas = researchAreas;
    if (department) user.department = department;
    if (isActive !== undefined) user.isActive = isActive;
    if (isEmailVerified !== undefined) user.isEmailVerified = isEmailVerified;

    await user.save();

    res.json({
      success: true,
      message: 'User updated successfully',
      data: user.getPublicProfile()
    });

  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update user',
      message: error.message
    });
  }
});

// @route   DELETE /api/users/:id
// @desc    Deactivate user (admin only)
// @access  Admin only
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    user.isActive = false;
    await user.save();

    res.json({
      success: true,
      message: 'User deactivated successfully'
    });

  } catch (error) {
    console.error('Error deactivating user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to deactivate user',
      message: error.message
    });
  }
});

// @route   POST /api/users/:id/activate
// @desc    Activate user (admin only)
// @access  Admin only
router.post('/:id/activate', auth, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    user.isActive = true;
    await user.save();

    res.json({
      success: true,
      message: 'User activated successfully'
    });

  } catch (error) {
    console.error('Error activating user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to activate user',
      message: error.message
    });
  }
});

module.exports = router;