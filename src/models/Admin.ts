import mongoose, { Document, Model } from 'mongoose';
import { nanoid } from 'nanoid';
import bcrypt from 'bcrypt';

// Define an interface for AdminDocument (represents a single document in the Admin collection)
interface AdminDocument extends Document {
    username: string;
    password: string;
    token: string;
    checkPassword(password: string): Promise<boolean>;
    generateToken(): void;
}


interface AdminModel extends Model<AdminDocument> {

}

const Schema = mongoose.Schema;

const SALT_WORK_FACTOR = 10;

const AdminSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Имя пользователя обязательно'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Пароль пользователя обязателен']
    },
    token: {
        type: String,
        required: true
    },
});

AdminSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

AdminSchema.set("toJSON", {
    transform: (doc, ret) => {
        delete ret.password;
        return ret;
    }
});

// Define instance methods for AdminDocument
AdminSchema.methods.checkPassword = function (password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
};

AdminSchema.methods.generateToken = function (): void {
    this.token = nanoid();
};

const Admin = mongoose.model<AdminDocument, AdminModel>("Admin", AdminSchema);

export default Admin;