import mongoose, { Document, Schema } from 'mongoose';

export interface ISettings {
    canSendNotification: boolean;
    allStartCount: number;
    uniqueStartCount: number;
    getResultCount: number;
}

export interface ISettingsDocument extends Document, ISettings {}

const settingsSchema = new Schema<ISettingsDocument>({
    canSendNotification: { type: Boolean, required: true, default: true },
    allStartCount: { type: Number, required: true, default: 0 },
    uniqueStartCount: { type: Number, required: true, default: 0 },
    getResultCount: { type: Number, required: true, default: 0 },
});

const Settings = mongoose.model<ISettingsDocument>('Settings', settingsSchema);

export default Settings;