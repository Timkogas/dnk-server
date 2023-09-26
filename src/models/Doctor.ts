import mongoose, { Document, Schema } from 'mongoose';

export enum doctorCategory {
    GIN = 'Гинеколог',
    TER = 'Терапевт',
    XIR = 'Пластический хирург',
    KOS = 'Косметолог',
}


export interface IDoctor {
    name: string
    mainInfo: string[]
    img: string
    video: string
    prof: string[]
    category: doctorCategory
    info: {
        [key: string]: string[]
    }
}

export interface IDoctorD extends Document {
    name: string
    mainInfo: string[]
    img: string
    video: string
    prof: string[]
    category: doctorCategory
    info: {
        [key: string]: string[]
    }
}


const doctorSchema = new Schema<IDoctorD>({
    name: { type: String, required: true },
    mainInfo: { type: [String], required: true },
    img: { type: String, required: true },
    video: { type: String, required: true },
    prof: { type: [String], required: true },
    category: { type: String, enum: Object.values(doctorCategory), required: true },
    info: { type: Map, of: [String], required: true },
});

const Doctor = mongoose.model<IDoctorD>('Doctor', doctorSchema);

export default Doctor;
