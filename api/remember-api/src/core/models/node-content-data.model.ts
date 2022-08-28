export class NodeContentData {
    file?: string;
    type?: string;
    content?: string;

}

export interface NodeFileContentData {
    file: string;
    type: string;
}

export interface NodeDirectContentData {
    content: string;
    type: string;
}