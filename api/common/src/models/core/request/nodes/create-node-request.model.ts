import { NodeContentType } from "../../../../enums/core/node-content-type.enum";
import { NodeType } from "../../../../enums/core/node-type.enum";


export interface CreateNodeContentRequest {
    
    file?: string;

    content?: string;

    type?: string;

}

export interface CreateNodeRequest {
    
    name: string;
    
    description: string;

    parents: string[];

    existingChildren: string[];

    newChildren?: CreateNodeRequest[];

    links?: string[];

    type: NodeType;

    contentType: NodeContentType;

    contentData?: CreateNodeContentRequest; 

    file?: any;

    tags?: string[];

    permissions?: string[];
}

