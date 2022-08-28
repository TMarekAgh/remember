import { ApiProperty } from "@nestjs/swagger";
import { CreateNodeContentRequest, NodeContentType, NodeType } from "@remember/api-common";
import { ContentHandler } from "src/core/classes/content-handler";
import { ReplaceNodeContentProps } from "../props/node/replace-node-content.props";

export class ReplaceNodeContentRequest {

    @ApiProperty()
    contentType: NodeContentType;

    @ApiProperty()
    contentData?: CreateNodeContentRequest; 

    @ApiProperty({ type: 'file' })
    file?: any;

    static async getProps(
        request: ReplaceNodeContentRequest, 
        files: Express.Multer.File[], 
        userId: string
    ): Promise<ReplaceNodeContentProps> {

        const contentType = +JSON.parse(request.contentType as any);

        let contentData = null;

        //this comes as string because of multipart
        if(request.contentData) {
            const requestContentData = JSON.parse(request.contentData as any);
            contentData =
                await ContentHandler.getContentData(contentType, requestContentData, files);  
        }
        

        const props: any = {
            contentType,
            contentData
        }
        
        return props;
    }
}