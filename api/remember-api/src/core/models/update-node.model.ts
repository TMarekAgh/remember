import { NodeType } from "../enums/node-type.enum";

export interface UpdateNodeProps {
    id: string;
    name?: string;
    description?: string;
    parents?: string[]
    links?: string[];
    children?: string[];
    type?: NodeType;
    tags?: string[];    
    permissions?: string[];
}