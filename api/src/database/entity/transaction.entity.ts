import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TransactionDocument = Transaction & Document;

@Schema({ timestamps: true })
export class Transaction {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  categoryId: string;

  @Prop({ required: true })
  categoryName: string;

  @Prop({ required: true })
  categoryIcon: string;

  @Prop({ required: true })
  categoryColor: string;

  @Prop({ required: true })
  isIncome: boolean;

  @Prop({ default: '' })
  note: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  time: Date;

  @Prop({ default: null })
  image: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
