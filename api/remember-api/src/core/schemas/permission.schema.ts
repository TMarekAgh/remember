import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type PermissionDocument = Permission & Document;

@Schema()
export class Permission {

    @Prop({ required: true })
    permissionScope: Scope;

    @Prop({ required: true })
    permissionType: Type;

    @Prop({ required: true })
    authoreeId: string;

    @Prop({ required: true })
    objectId: string;

    @Prop({ required: true })
    actions: Action[];

    @Prop({ required: true })
    cascade: boolean;

}

export const PermissionSchema = SchemaFactory.createForClass(Permission);

export enum Action {
    Full,
    Read,
    Write,
    Create,
    Update,
    Delete,
    Move
}

export enum Type {
    Allow, // Allows selected actions
    Deny, // Denies selected actions
    Clear // Clears selected action(so that the default is applied)
}

export enum Scope {
    Public,
    Group,
    User,
}