import { INodeDocument } from "../../node";
import { NodeType, NodeSubType } from '../../../../enums'

export class NodeResponse {
    static dictionary(node: INodeDocument): DictionaryNodeResponse {
        return {
            id: node._id,
            name: node.name
        }
    }

    static minified(node: INodeDocument): MinifiedNodeResponse {
        return {
            id: node._id,
            name: node.name,
            description: node.description,
            type: node.type,
            subtype: node.subtype,
            creatorId: node.creatorId,
            nodeLinks: node.nodeLinks,
            nodeChildren: node.nodeChildren,
            nodeParents: node.nodeParents,
            tags: node.tags,
            permissions: node.permissions
        }
    }

    static project(node: INodeDocument, project: string) {
        switch(project) {
            case 'dictionary': 
                return NodeResponse.dictionary(node);
            case 'minified':
                return NodeResponse.minified(node);
        }
    }
}

export interface DictionaryNodeResponse {
    id: string;
    name: string;
}

export interface MinifiedNodeResponse {
    id: string;
    name: string;
    description: string;
    type: NodeType;
    subtype: NodeSubType;
    nodeLinks: string[];
    nodeChildren: string[];
    nodeParents?: string[];
    tags: string[];
    permissions: string[];
    creatorId: string;
}

export interface FullNodeResponse {}

export interface INodeResponse {
    id: string;
    name: string;
    description: string;
    type: NodeType;
    subtype: NodeSubType;
    nodeLinks: string[];
    nodeChildren: string[];
    nodeParents?: string[];
    tags: string[];
    permissions: string[];
    creatorId: string;
}

