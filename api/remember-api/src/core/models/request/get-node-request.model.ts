import { ApiProperty } from "@nestjs/swagger";
import { NodeProjection } from "@remember/api-common";
import { GetNodeProps } from "../get-node.model";

export const defaultNodeProjection = NodeProjection.Minified;
export const defaultAdjacentProjection = NodeProjection.Minified;

export class GetNodeRequest {

    @ApiProperty()
    project?: string;

    @ApiProperty()
    getAdjacent: boolean;

    @ApiProperty()
    projectAdjacent?: string;    

    static getProps(request: GetNodeRequest): GetNodeProps {
        const project = request.project ? 
            nodeProjections[request.project] : 
            nodeProjections[defaultNodeProjection];
        const getAdjacent = request.getAdjacent ?? false;
        const projectAdjacent = request.projectAdjacent ? 
            nodeProjections[request.projectAdjacent] : 
            nodeProjections[defaultAdjacentProjection];

        return { getAdjacent, project, projectAdjacent };
    }
    
}

export const nodeProjections = {
    dictionary: {
        _id: 1,
        name: 1,
    },
    minified: {
        name: 1,
        description: 1,
        type: 1,
        subtype: 1,
        nodeLinks: 1,
        nodeChildren: 1,
        tags: 1,
        creatorId: 1,
        permissions: 1
    },
    full: {

    },
}