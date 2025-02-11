import mongoose, { Schema, Document, Model } from 'mongoose';
import { IMessage } from './Message';

interface ICourse extends Document {
  title: string;
  courseId: number;
  description: string;
  imageUrl: string;
  messages: IMessage[];
}

const courseSchema: Schema<ICourse> = new mongoose.Schema({
  title: { type: String, required: true },
  courseId: { type: Number, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }] //required: true },
});

const Course: Model<ICourse> = mongoose.model<ICourse>(
    'Course', courseSchema
);

export default Course;
export { Course };
export { ICourse };