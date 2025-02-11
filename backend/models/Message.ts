import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User';

interface IMessage extends Document {
    timestamp: string;
    sender: string;
    content: string;
}

const MessageSchema: Schema = new Schema({
    timestamp: { type: String, required: true},
    sender: { type: String, required: true},
    content: { type: String, required: true}
});

const Message = mongoose.model<IMessage>(
    'Message', 
    MessageSchema
);

export default Message;
export { IMessage };