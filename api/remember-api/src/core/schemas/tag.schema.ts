import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type TagDocument = Tag & Document;

@Schema()
export class Tag {

    constructor(name: string, creatorId: string) {
        this.name = name;
        this.creator = creatorId
    }

    @Prop({ required: true })
    public name: string;

    @Prop({ required: true })
    public creator: string;
}

export const TagSchema = SchemaFactory.createForClass(Tag);