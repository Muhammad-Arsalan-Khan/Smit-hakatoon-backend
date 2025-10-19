// controllers/familyController.js
import Family from '../../models/history/family.js';

// Create family
export const createFamily = async (req, res) => {
  try {
    const userId = req.user._id; // From auth middleware
    const { familyName, members } = req.body;

    // Check if family already exists
    let family = await Family.findOne({ adminUserId: userId });
    
    if (family) {
      return res.status(400).json({
        success: false,
        error: 'Family already exists. Please add members to existing family.'
      });
    }

    family = await Family.create({
      adminUserId: userId,
      familyName: familyName || 'My Family',
      members: members || []
    });

    res.status(201).json({
      success: true,
      message: 'Family created successfully',
      family
    });
  } catch (error) {
    console.error('Create family error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create family'
    });
  }
};

// Add family member
export const addFamilyMember = async (req, res) => {
  try {
    const userId = req.user._id;
    const memberData = req.body;

    const family = await Family.findOne({ adminUserId: userId });
    
    if (!family) {
      return res.status(404).json({
        success: false,
        error: 'Family not found. Please create family first.'
      });
    }

    family.members.push(memberData);
    await family.save();

    res.json({
      success: true,
      message: 'Family member added successfully',
      member: family.members[family.members.length - 1]
    });
  } catch (error) {
    console.error('Add member error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add family member'
    });
  }
};

// Get all family members
export const getFamilyMembers = async (req, res) => {
  try {
    const userId = req.user._id;

    const family = await Family.findOne({ adminUserId: userId });
    
    if (!family) {
      return res.json({
        success: true,
        members: []
      });
    }

    res.json({
      success: true,
      familyName: family.familyName,
      members: family.members.filter(m => m.isActive),
      memberCount: family.members.filter(m => m.isActive).length
    });
  } catch (error) {
    console.error('Get members error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get family members'
    });
  }
};

// Update family member
export const updateFamilyMember = async (req, res) => {
  try {
    const userId = req.user._id;
    const { memberId } = req.params;
    const updateData = req.body;

    const family = await Family.findOne({ adminUserId: userId });
    
    if (!family) {
      return res.status(404).json({
        success: false,
        error: 'Family not found'
      });
    }

    const member = family.members.id(memberId);
    
    if (!member) {
      return res.status(404).json({
        success: false,
        error: 'Family member not found'
      });
    }

    Object.assign(member, updateData);
    await family.save();

    res.json({
      success: true,
      message: 'Family member updated successfully',
      member
    });
  } catch (error) {
    console.error('Update member error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update family member'
    });
  }
};

// Delete (deactivate) family member
export const deleteFamilyMember = async (req, res) => {
  try {
    const userId = req.user._id;
    const { memberId } = req.params;

    const family = await Family.findOne({ adminUserId: userId });
    
    if (!family) {
      return res.status(404).json({
        success: false,
        error: 'Family not found'
      });
    }

    const member = family.members.id(memberId);
    
    if (!member) {
      return res.status(404).json({
        success: false,
        error: 'Family member not found'
      });
    }

    member.isActive = false;
    await family.save();

    res.json({
      success: true,
      message: 'Family member removed successfully'
    });
  } catch (error) {
    console.error('Delete member error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete family member'
    });
  }
};

// Get member health summary
export const getMemberHealthSummary = async (req, res) => {
  try {
    const userId = req.user._id;
    const { memberId } = req.params;

    const family = await Family.findOne({ adminUserId: userId });
    
    if (!family) {
      return res.status(404).json({
        success: false,
        error: 'Family not found'
      });
    }

    const member = family.members.id(memberId);
    
    if (!member) {
      return res.status(404).json({
        success: false,
        error: 'Family member not found'
      });
    }

    // Get chat history for this member
    const ChatHistory = mongoose.model('ChatHistory');
    const reports = await ChatHistory.find({
      userId,
      familyMemberId: memberId
    }).sort({ sessionDate: -1 }).limit(10);

    res.json({
      success: true,
      member: {
        name: member.name,
        relation: member.relation,
        age: member.age,
        bloodGroup: member.bloodGroup,
        medicalHistory: member.medicalHistory
      },
      recentReports: reports,
      totalReports: reports.length
    });
  } catch (error) {
    console.error('Get health summary error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get health summary'
    });
  }
};