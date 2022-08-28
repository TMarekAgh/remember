import { NodeContentType, NodeSubType, NodeType } from "@remember/api-common";

export type CreateNodeProps = {
    name: string;
    description: string;
    links?: string[];
    children: string[];
    parents: string[];
    type: NodeType;
    subtype?: NodeSubType;
    contentType?: NodeContentType;
    contentData?: any; //? CreateNodeContentProps
    creatorId: string;
    permissions?: string[];
    tags?: string[];
    removable?: boolean;
    editable?: boolean;
}