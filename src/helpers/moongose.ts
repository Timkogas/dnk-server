import mongoose, { ConnectOptions } from 'mongoose';
import Settings from '../models/Settings';

export const connectMongoDB = async (mongoURI: string): Promise<typeof mongoose>=> {
  try {
    const client =  mongoose.connect(mongoURI, { useUnifiedTopology: true, useNewUrlParser: true, } as ConnectOptions);

    const existingSettings = await Settings.findOne({});

    // Если запись не существует, создаем новую
    if (!existingSettings) {
      const initialSettings = new Settings({
        canSendNotification: true,
        allStartCount: 0,
        uniqueStartCount: 0,
        getResultCount: 0
      });

      await initialSettings.save();
      console.log('Начальные настройки успешно сохранены');
    } else {
      console.log('Начальные настройки уже существуют');
    }

    return client
  } catch (error) {
    console.error('Error connecting to MongoDB', error);
    process.exit(1);
  }
};