import mongoose, { ConnectOptions } from 'mongoose';

export const connectMongoDB = async (mongoURI: string): Promise<typeof mongoose>=> {
  try {
    const client =  mongoose.connect(mongoURI, { useUnifiedTopology: true, useNewUrlParser: true, } as ConnectOptions);
    return client
  } catch (error) {
    console.error('Error connecting to MongoDB', error);
    process.exit(1);
  }
};