import mongoose from 'mongoose';

const UserRef = {
  type: mongoose.Schema.Types.ObjectId,
  required: false,
  ref: 'User',
};
const ReactionSchema = new mongoose.Schema(
  {
    users: [UserRef],
    emoji: {
      type: String,
      enum: [':+1:', ':-1:', ':smile:', ':heart:', ':confused:', ':tada:'],
      required: true,
    },
  },
  { _id: false }
);

export default ReactionSchema;
