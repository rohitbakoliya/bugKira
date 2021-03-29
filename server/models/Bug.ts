import mongoose, { Document } from 'mongoose';
import { UserInfoSchema } from './User';
import autoIncrement from 'mongoose-auto-increment';
import ReactionSchema from './Reaction';
import { CommentSchema } from './Comment';

// plugin initialize
autoIncrement.initialize(mongoose.connection);
const VALID_LABELS = ['bug', 'feature', 'help wanted', 'enhancement'];

const ActivitiesSchema = new mongoose.Schema(
  {
    action: { type: String, enum: ['closed', 'opened'], required: true },
    author: { type: UserInfoSchema, required: true },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

enum Elabels {
  'bug',
  'feature',
  'help wanted',
  'enhancement',
}

export interface IBug extends Document {
  title: string;
  body: string;
  dateOpened: Date;
  labels: Elabels;
  author: any;
  isOpen: boolean;
  activities: Array<any>;
  comments: Array<any>;
  reactions: Array<any>;
  [x: string]: any;
}

const BugSchema = new mongoose.Schema<IBug>({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 6,
    maxlength: 100,
  },
  body: {
    type: String,
    required: true,
    maxLength: 2000,
  },
  dateOpened: {
    type: Date,
    default: Date.now,
  },
  labels: {
    type: [String],
    enum: VALID_LABELS,
  },
  autor: {
    type: UserInfoSchema,
    required: true,
  },
  isOpen: { type: Boolean, default: true },
  activities: [{ type: ActivitiesSchema }],
  comments: [{ type: CommentSchema }],
  reactions: [{ type: ReactionSchema }],
});

BugSchema.set('toJSON', {
  transform: function (_doc: any, ret: any) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});

// enable plugin
BugSchema.plugin(autoIncrement.plugin, {
  model: 'Bug',
  field: 'bugId',
  startAt: 1,
});

// create a model
const Bug = mongoose.model<IBug>('Bug', BugSchema);
export default Bug;
