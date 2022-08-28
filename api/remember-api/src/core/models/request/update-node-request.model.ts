import { ApiProperty } from "@nestjs/swagger";
import { NodeType } from "../../enums/node-type.enum";
import { UpdateNodeProps } from "../update-node.model";
import { CreateNodeRequest } from "./create-node-request.model";

export class UpdateNodeRequest {
    
    @ApiProperty() 
    id: string;

    @ApiProperty()
    name: string;
    
    @ApiProperty()
    description: string;

    @ApiProperty()
    parents?: string[];

    @ApiProperty()
    children?: string[];

    @ApiProperty()
    addChildren?: CreateNodeRequest[];

    @ApiProperty()
    links?: string[];

    @ApiProperty()
    tags?: string[];

    @ApiProperty()
    type: NodeType; //?

    static getProps(request: UpdateNodeRequest): UpdateNodeProps {
        return {
            id: request.id,
            name: request.name,
            description: request.description,
            parents: request.parents,
            children: request.children,
            links: request.links,
            type: request.type,
            tags: request.tags
        }
    }
}