import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ChatDocument = Chat & Document;

@Schema()
export class Chat {
  @Prop()
  _id: string;

  @Prop()
  chat: string;

  @Prop()
  role: string;

  @Prop()
  content: string;

  @Prop()
  username: string;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
