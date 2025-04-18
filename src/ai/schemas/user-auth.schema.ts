import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserAuthDocument = UserAuth & Document;

@Schema({ timestamps: true })
export class UserAuth {
  @Prop({ required: true })
  reference_id: string;

  @Prop({ type: Object })
  ai_config: Record<string, any>;

  @Prop({ default: true })
  is_active: boolean;

  @Prop({ type: Date })
  created_at: Date;

  @Prop({ type: Date })
  updated_at: Date;
}

export const UserAuthSchema = SchemaFactory.createForClass(UserAuth);
