import { CreateNodeContentRequest, NodeContentType, NodeType } from "@remember/api-common";

export type ReplaceNodeContentProps = {
    type: NodeType;

    contentType: NodeContentType;

    contentData?: CreateNodeContentRequest; 

    file?: any;
}