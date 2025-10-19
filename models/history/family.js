// models/Family.js
import mongoose from 'mongoose';

const familyMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  relation: {
    type: String,
    enum: ['Self', 'Father', 'Mother', 'Brother', 'Sister', 'Spouse', 'Son', 'Daughter', 'Grandfather', 'Grandmother', 'Other'],
    required: true
  },
  dateOfBirth: Date,
  age: Number,
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other']
  },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown']
  },
  profilePhoto: String,
  medicalHistory: {
    chronicDiseases: [String], // ['Diabetes', 'Hypertension']
    allergies: [String],
    currentMedications: [String]
  },
  contactNumber: String,
  emergencyContact: String,
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

const familySchema = new mongoose.Schema({
  adminUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  familyName: {
    type: String,
    default: 'My Family'
  },
  members: [familyMemberSchema],
  invitedMembers: [{
    email: String,
    invitedAt: Date,
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending'
    }
  }]
}, { timestamps: true });

// Virtual for total members count
familySchema.virtual('memberCount').get(function() {
  return this.members.filter(m => m.isActive).length;
});

export default mongoose.model('Family', familySchema);