import { INodeResponse } from "./node-reponse.model"

export interface GetNodeResponse {
    node: INodeResponse;
    adjacent?: AdjacentResponse;
}

export interface AdjacentResponse {
    children: INodeResponse[];
    parents: INodeResponse[];
    links: INodeResponse[];
}