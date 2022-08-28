import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { NodeSubType } from "../enums/node-subtype.enum";
import { NodeType } from "../enums/node-type.enum";
import { NodeContentType } from '../enums/node-content-type.enum';
import { NodeContentData } from '../models/node-content-data.model';
import { INode } from '@remember/api-common';
import { CreateNodeProps } from '../models/props/node/create-node.props';

export type NodeDocument = Node & Document;

@Schema()
export class Node implements INode {

    constructor(props: CreateNodeProps) {
        this.name = props.name;
        this.description = props.description;
        this.type = props.type;
        if(props.links) this.nodeLinks = props.links;
        if(props.children) this.nodeChildren = props.children;
        if(props.subtype) this.subtype = props.subtype;
    }

    @Prop({ required: true })
    public name: string;

    @Prop({ required: true })
    public description: string;

    @Prop({ required: true })
    public nodeLinks: string[] = [];

    @Prop({ required: true })
    public nodeChildren: string[] = [];

    @Prop({ required: true })
    public type: NodeType;

    @Prop({ required: true })
    public subtype: NodeSubType = NodeSubType.Undefined;

    @Prop()
    public contentType: NodeContentType;

    @Prop()
    public contentData: NodeContentData; //NodeContentData

    // Id of the creator
    @Prop({ required: true })
    public creatorId: string;

    //** Simplified version, contains list of allowed users */
    @Prop({ required: true })
    public permissions: string[] = [];

    //** Contains list of tagIds */    
    @Prop({ required: true })
    public tags: string[];

    //** Defines whether the node is possible to delete */
    @Prop({ type: 'boolean' })
    public removable = true;

    //** Defines whether the node is possible to edit */
    @Prop({ type: 'boolean' })
    public editable = true;

    //** Optional property used to return array of parent ids in certaion situations */
    public nodeParents?: string[];
}

export const NodeSchema = SchemaFactory.createForClass(Node);



export type CreateNodeTree = {
    childrenProps?: (CreateNodeProps & CreateNodeTree)[]
}