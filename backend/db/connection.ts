import mongoose from 'mongoose';
import process from 'process';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect('mongodb://192.168.1.10:27017/StudyHub').then(() => console.log('Connected to MongoDB'))
        .catch(err => console.error('Error connecting to MongoDB:', err));
        
    } catch (error) {
        if (error instanceof Error) {
            console.error(`Error: ${error.message}`);
        } else {
            console.error('An unknown error occurred');
        }
        process.exit(1);
    }
};

export default connectDB;
