import mongoose, { Document } from 'mongoose';
import ReactionSchema from './Reaction';
import { UserInfoSchema } from './User';

export interface IComment extends Document {
  body: string;
  date: Date;
  reactions: Array<any>;
  author: any;
  [x: string]: any;
}

const CommentSchema = new mongoose.Schema<IComment>({
  body: {
    type: String,
    required: true,
    trim: true,
    minLength: 6,
    maxLength: 1000,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  reactions: [{ type: ReactionSchema }],
  author: { type: UserInfoSchema, required: true },
});

CommentSchema.set('toJSON', {
  transform: function (_doc: any, ret: any) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});

const Comment = mongoose.model<IComment>('Comment', CommentSchema, 'bugs');

export default Comment;
export { CommentSchema };
