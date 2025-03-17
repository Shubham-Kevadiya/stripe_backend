import mongoose from 'mongoose';
import config from '../config/config.js';

export const connectToDatabase = async () => {
  try {
    await mongoose.connect(config.db.db_url);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
};
