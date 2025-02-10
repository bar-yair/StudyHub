import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User';

interface IMessage extends Document {
    timestamp: Date;
    sender: IUser;
    content: string;
}

const MessageSchema: Schema = new Schema({
    timestamp: { type: Date, default: Date.now, required: true},
    sender: { type: Schema.Types.ObjectId, required: true},
    content: { type: String, required: true}
});

const Message = mongoose.model<IMessage>(
    'Message', 
    MessageSchema
);

export default Message;
export { IMessage };