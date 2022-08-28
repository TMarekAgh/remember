import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type UserAssociationDocument = UserAssociation & Document;

@Schema()
export class UserAssociation {

    constructor(data: CreateUserAssociation) {
        this.userId = data.userId;
        this.associated = data.associated;
    }

    @Prop({ required: true })
    public userId: string;

    @Prop({ required: true })
    public associated: string[] = [];
}

export const UserAssociationSchema = SchemaFactory.createForClass(UserAssociation);

export interface CreateUserAssociation {
    userId: string;
    associated: string[];
}