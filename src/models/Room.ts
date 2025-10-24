import mongoose from 'mongoose';

const RoomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  resources: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

export default mongoose.models.Room || mongoose.model('Room', RoomSchema);
