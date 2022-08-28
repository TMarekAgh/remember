import { NodeType } from "../../../../enums/core/node-type.enum";
import { CreateNodeRequest } from "./create-node-request.model";

export interface UpdateNodeRequest {
    
    id: string;

    name: string;
    
    description: string;

    parents: string[];

    children?: string[];

    addChildren?: CreateNodeRequest[];

    links?: string[];

    type: NodeType; 
    
    tags?: string[];
}