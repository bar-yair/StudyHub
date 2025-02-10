import mongoose, { Document, Schema, Model } from 'mongoose';

// Define an interface for the User document
interface IUser extends Document {
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: string;
  username: string;
  password: string;
  isModified: (path: string) => boolean;
}

// Define the Mongoose schema
const userSchema: Schema<IUser> = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  birthDate: { type: String, required: true },
  gender: { type: String, required: true },
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});


// Create the model with the IUser interface
const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);

export default User;
export { IUser };
