import Admin from "../models/Admin";
import { connectMongoDB } from "./moongose";
import { nanoid } from 'nanoid';
import dotenv from 'dotenv';

dotenv.config();

const adminFixture = async () => {
    const mongoURI: string = process.env.DB_MONGODB_URI;
    const username: string = process.env.ADMIN_USERNAME;
    const password: string = process.env.ADMIN_PASSWORD;

    let connection;

    try {
        connection = await connectMongoDB(mongoURI);
    } catch (error) {
        console.error('Error connecting to MongoDB', error);
        process.exit(1);
    }

    try {
        await connection.connection.dropCollection("admins")
    } catch (e) {
        console.log("Skipping drop");
    }

    try {

        const admin = new Admin({
            username: username,
            password: password,
            token: nanoid()
        });

        await admin.save();
        console.log('Admin created successfully');
    }

    catch (error) {
        console.error('Error creating Admin', error);
    }

    connection.connection.close();
    console.log('End adminFixture');
};

adminFixture();