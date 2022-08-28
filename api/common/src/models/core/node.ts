import { NodeContentType, NodeSubType, NodeType } from '../../enums';

export interface INode {
    name: string;
    description: string;
    nodeLinks: string[];
    nodeChildren: string[];
    type: NodeType;
    subtype: NodeSubType;
    contentType: NodeContentType;
    contentData: any;
    nodeParents?: string[];
    tags: string[];
    permissions: string[];
    creatorId: string;
}

export interface INodeDocument extends INode {
    _id: string;
}