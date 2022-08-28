import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserAuthAssocDocument = UserAuthAssoc & Document;

@Schema()
export class UserAuthAssoc {
    
    @Prop()
    authSource: number;

    @Prop()
    srcId: string;

    @Prop()
    userId: string;
    
}

export const UserAuthAssocSchema = SchemaFactory.createForClass(UserAuthAssoc);