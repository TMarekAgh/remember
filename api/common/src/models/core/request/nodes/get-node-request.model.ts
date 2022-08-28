export interface GetNodeRequest {

    project?: string;

    getAdjacent: boolean;

    projectAdjacent?: string; 
    
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
        creatorId: 1,
        nodeLinks: 1,
        nodeChildren: 1,
        tags: 1
    },
    full: {

    },
}