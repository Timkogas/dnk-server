import mongoose, { Document, Schema } from 'mongoose';
export type UserInfo = {
  id: number;
  first_name: string;
  last_name: string;
  sex: 0 | 1 | 2;
  city: {
      id: number;
      title: string;
  };
  country: {
      id: number;
      title: string;
  };

  bdate?: string;
  photo_100: string;
  photo_200: string;
  photo_max_orig?: string;
  timezone?: number;
};

interface IUser extends Document {
  uid: string;
  notifications: boolean;
  archetype: Schema.Types.ObjectId | null;
  lastLoginDate: Date;
  vkdata?: UserInfo;
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
  vkdata: { type: Object }
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;