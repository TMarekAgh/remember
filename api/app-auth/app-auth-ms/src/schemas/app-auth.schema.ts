import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AppAuthDocument = AppAuth & Document;

@Schema()
export class AppAuth {
    
    @Prop()
    public name: string;

    @Prop()
    public token: string;

    @Prop()
    public test: string;    

}

export const AppAuthSchema = SchemaFactory.createForClass(AppAuth);
