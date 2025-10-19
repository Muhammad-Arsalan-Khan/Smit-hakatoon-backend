// models/ChatHistory.js
import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  from: {
    type: String,
    enum: ['user', 'bot'],
    required: true
  },
  text: {
    type: String,
    required: true
  },
  fileInfo: {
    fileName: String,
    fileSize: Number,
    fileType: String,
    filePath: String
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, { _id: true });

const chatHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  sessionDate: {
    type: Date,
    required: true,
    index: true
  },
  messages: [messageSchema],
  reportMetadata: {
    totalReports: {
      type: Number,
      default: 0
    },
    lastReportDate: Date
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
chatHistorySchema.index({ userId: 1, sessionDate: -1 });

// Method to add message
chatHistorySchema.methods.addMessage = async function(messageData) {
  this.messages.push(messageData);
  
  if (messageData.from === 'user' && messageData.fileInfo) {
    this.reportMetadata.totalReports += 1;
    this.reportMetadata.lastReportDate = new Date();
  }
  
  return this.save();
};

// Static method to get or create today's session
chatHistorySchema.statics.getTodaySession = async function(userId) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  let session = await this.findOne({
    userId,
    sessionDate: { $gte: today, $lt: tomorrow }
  });
  
  if (!session) {
    session = await this.create({
      userId,
      sessionDate: today,
      messages: [{
        from: 'bot',
        text: 'Assalamualaikum! Apni report upload kijiye ya yahan type karke bat kijiye.',
        timestamp: new Date()
      }]
    });
  }
  
  return session;
};

// Static method to get user's all history
chatHistorySchema.statics.getUserHistory = async function(userId, options = {}) {
  const { limit = 30, page = 1 } = options;
  
  return this.find({ userId })
    .sort({ sessionDate: -1 })
    .limit(limit)
    .skip((page - 1) * limit)
    .lean();
};

export default mongoose.model('ChatHistory', chatHistorySchema);