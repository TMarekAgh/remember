import { ApiProperty } from "@nestjs/swagger";
import { ContentHandler } from "src/core/classes/content-handler";
import { NodeContentType } from "src/core/enums/node-content-type.enum";
import { NodeSubType } from "../../enums/node-subtype.enum";
import { NodeType } from "../../enums/node-type.enum";
import { CreateNodeTree } from "../../schemas/node.schema";
import { CreateNodeProps } from "../props/node/create-node.props";

export class CreateNodeContentRequest {
    
    @ApiProperty()
    file?: string;

    @ApiProperty()
    content?: string;

    @ApiProperty()
    type?: string;

}

export class CreateNodeRequest {
    
    @ApiProperty()
    name: string;
    
    @ApiProperty()
    description: string;

    @ApiProperty()
    parents: string[];

    @ApiProperty()
    existingChildren?: string[];

    @ApiProperty({ type: () => CreateNodeRequest, required: false })
    newChildren?: CreateNodeRequest[];

    @ApiProperty({ required: false })
    links?: string[];

    @ApiProperty()
    type: NodeType;

    @ApiProperty()
    contentType: NodeContentType;

    @ApiProperty()
    contentData?: CreateNodeContentRequest; 

    @ApiProperty({ type: 'file' })
    file?: any;

    @ApiProperty()
    tags?: string[];

    @ApiProperty()
    permissions?: string[];

    static async getProps(request: CreateNodeRequest, files: Express.Multer.File[], userId: string): Promise<CreateNodeProps & CreateNodeTree> {

        const contentType = +JSON.parse(request.contentType as any);
        const type = +JSON.parse(request.type as any);

        let contentData = null;

        if(request.contentData) {
            const requestContentData = JSON.parse(request.contentData as any) //this comes as string because of multipart
            contentData = type == NodeType.File || type == NodeType.View ? 
                await ContentHandler.getContentData(contentType, requestContentData, files) :
                null;
        }
        const links = request.links ? JSON.parse(request.links as any) : [];
        const children = request.existingChildren ? JSON.parse(request.existingChildren as any) : [];
        const newChildren = request.newChildren ? JSON.parse(request.newChildren as any) : []; 
        const parents = request.parents ? JSON.parse(request.parents as any) : [];
        const tags = request.tags ? JSON.parse(request.tags as any) : []
        const permissions = request.permissions ? JSON.parse(request.permissions as any) : [];

        const props: CreateNodeProps & CreateNodeTree = {
            name: request.name,
            description: request.description,
            type: type,       
            parents,
            subtype: NodeSubType.Undefined,
            children: [],
            contentType,
            contentData,
            creatorId: userId,
            permissions: [ ...permissions, userId],
            tags,
            removable: true,
            editable: true
        }

        if(links) 
            props.links = links;

        if(children) 
            props.children = children;

        if(newChildren) {            
            const children = [];

            for await (const child of newChildren) 
                children.push(await CreateNodeRequest.getProps(child, files, userId));

            props.childrenProps = children;
        }
        
        return props;
    }
}

