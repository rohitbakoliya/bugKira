import Joi from 'joi';
import mongoose, { Document, Schema } from 'mongoose';

type Provider = 'google' | 'local';
export interface IUser extends Document {
  name: string;
  username: string;
  email: string;
  password: string;
  bio: string;
  avatar: string;
  avatarUrl: string;
  createdAt: Date;
  isVerified: boolean;
  provider: Array<Provider>;
  googleId: string;
}

export const UserSchema: Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minLength: 2,
      maxLength: 100,
    },
    username: {
      type: String,
      required: true,
      trim: true,
      minLength: 4,
      maxLength: 50,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      minLength: 5,
      maxLength: 100,
      unique: true,
    },
    password: {
      type: String,
      minLength: 6,
      maxLength: 50,
    },
    bio: {
      type: String,
      minLength: 1,
      maxLength: 200,
      default: '404 bio not found!',
    },
    avatar: {
      type: mongoose.Types.ObjectId,
    },
    avatarUrl: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    // auth
    isVerified: { type: Boolean, default: false },
    provider: { type: [String], enum: ['google', 'local'], required: true },
    googleId: { type: String },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', UserSchema);

// validation
export const validateUserSignup = (user: any) => {
  const SignupSchema = Joi.object({
    // name: Joi.string().required().min(2).max(50).trim(),
    username: Joi.string()
      .required()
      .pattern(/^[a-zA-z0-9._-]+$/, 'Only . _ - these special symbol are allowed')
      .min(4)
      .max(50)
      .trim(),
    email: Joi.string().required().min(5).max(100).email({ minDomainSegments: 2 }).trim(),
    password: Joi.string().required().min(6).max(50),
    confirmPassword: Joi.string().required().min(6).max(50).valid(Joi.ref('password')),
    avatar: Joi.string(),
    createdAt: Joi.date().default(Date.now),
  });
  SignupSchema.validate(user);
};

export const validateUserLogin = (user: any) => {
  const schema = Joi.object({
    email: Joi.string().min(5).max(100).required().email({ minDomainSegments: 2 }),
    password: Joi.string().min(6).max(100).required(),
  });
  return schema.validate(user);
};
