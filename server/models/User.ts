import Joi, { ValidationResult } from 'joi';
import mongoose, { Document } from 'mongoose';
import bcrypt from 'bcryptjs';

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

export const UserSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      // required: true,
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

UserSchema.pre('save', function (next) {
  if (!this.provider.includes('local')) next();
  // to only hash password when user signed up or update their password
  if (this.isModified('password') || this.isNew) {
    try {
      // Hash Password
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(this.password, salt);
      this.password = hashedPassword;
      next();
    } catch (err) {
      next(err);
    }
  } else {
    return next();
  }
});

UserSchema.methods.isValidPassword = async function (password) {
  try {
    // Check/Compares password
    return await bcrypt.compare(password, this.password);
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

// create the model
export const User = mongoose.model<IUser>('User', UserSchema);

// input validation
export const validateUserSignup = (user: any): ValidationResult => {
  const SignupSchema = Joi.object({
    // name: Joi.string().required().min(2).max(50).trim(),
    username: Joi.string()
      .required()
      .pattern(/(^[A-Za-z0-9]+(_|.)?[A-Za-z0-9]+$)/, 'Invalid username')
      .min(4)
      .max(50)
      .trim(),
    email: Joi.string().required().min(5).max(100).email({ minDomainSegments: 2 }).trim(),
    password: Joi.string().required().min(6).max(50),
    confirmPassword: Joi.string().required().min(6).max(50).valid(Joi.ref('password')),
    avatar: Joi.string(),
    createdAt: Joi.date().default(Date.now),
  });
  return SignupSchema.validate(user);
};

/**
 * @param user express user
 * @param hasEmail email is used for login
 */
export const validateUserLogin = (user: any, hasEmail: boolean): ValidationResult => {
  if (hasEmail) {
    const emailSchema = Joi.object({
      uoe: Joi.string().min(5).max(100).required().email({ minDomainSegments: 2 }),
      password: Joi.string().min(6).max(100).required(),
    });
    return emailSchema.validate(user);
  }
  const usernameSchema = Joi.object({
    uoe: Joi.string()
      .required()
      .pattern(/(^[A-Za-z0-9]+(_|.)?[A-Za-z0-9]+$)/, 'Invalid username')
      .min(4)
      .max(50)
      .trim(),
    password: Joi.string().min(6).max(100).required(),
  });
  return usernameSchema.validate(user);
};
