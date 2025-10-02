import mongoose, { Document, Schema } from 'mongoose';

// Example User model - you can modify this or create new models as needed
export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  googleId?: string;
  picture?: string;
  z: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    trim: true,
    match: [/^\+?[\d\s-()]+$/, 'Please enter a valid phone number']
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true, // Allows null values while maintaining uniqueness for non-null values
    index: true
  },
  picture: {
    type: String,
    trim: true
  },
  hasRSVPd: {
    type: Boolean,
    default: false,
    required: true
  }
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
  collection: 'users' // Explicitly set collection name
});

// Index for better query performance
UserSchema.index({ email: 1 });
UserSchema.index({ firstName: 1, lastName: 1 });

// Virtual for full name
UserSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Ensure virtual fields are serialized
UserSchema.set('toJSON', {
  virtuals: true
});

export const User = mongoose.model<IUser>('User', UserSchema);

