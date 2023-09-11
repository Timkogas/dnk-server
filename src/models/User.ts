import mongoose, { Document, Schema } from 'mongoose';

interface IUser extends Document {
  uid: string;
  notifications: boolean;
  archetype: Schema.Types.ObjectId | null;
  lastLoginDate: Date;
}

const userSchema = new Schema<IUser>({
  uid: { type: String, unique: true, required: true},
  notifications: { type: Boolean, default: false, required: true },
  archetype: { 
    type: Schema.Types.ObjectId, 
    ref: 'Archetype',
    default: null
  },
  lastLoginDate: { type: Date, default: Date.now, required: true },
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;