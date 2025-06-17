import mongoose from 'mongoose';

const deletionLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  email: String,
  deletedAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    default: 'success',
  }
});

const DeletionLog = mongoose.model('DeletionLog', deletionLogSchema);
export default DeletionLog;
