import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IMessageData extends Document {
  user: {
    id: string;
    name?: string;
    email?: string;
    form_data?: {
      price?: number;
      items?: string[];
      [key: string]: any; // allow additional fields
    };
    [key: string]: any; // allow other fields
  };
  vendor: {
    id: string;
    name?: string;
    email?: string;
    service?: string;
    [key: string]: any; // allow other fields
  };
  status: 'accepted' | 'not-accepted' | 'pending';
  createdAt: Date;
}

const MessageDataSchema = new Schema<IMessageData>({
  user: {
    id: { type: String, required: true },
    name: { type: String },
    email: { type: String },
    form_data: {
      price: { type: Number },
      items: [{ type: String }],
    },
  },
  vendor: {
    id: { type: String, required: true },
    name: { type: String },
    email: { type: String },
    service: { type: String },
  },
  status: {
    type: String,
    enum: ['accepted', 'not-accepted', 'pending'],
    default: 'pending'
  },
  createdAt: { type: Date, default: Date.now },
});

const MessageData = mongoose.model<IMessageData>('MessageData', MessageDataSchema);

export default MessageData;
