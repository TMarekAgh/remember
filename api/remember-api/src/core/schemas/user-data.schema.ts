import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type UserDataDocument = UserData & Document;

@Schema()
export class UserData {

    constructor(data: CreateUserData) {
        this.rootNode = data.rootNode;
        this.userId = data.userId;
    }

    @Prop({ required: true })
    public rootNode: string;

    @Prop({ required: true })
    public userId: string;
}

export const UserDataSchema = SchemaFactory.createForClass(UserData);

export interface CreateUserData {
    userId: string;
    rootNode: string;
}