import { ApiProperty } from "@nestjs/swagger";
import { ReplaceNodeViewProps } from "../props/node/replace-node-view.props";

export class ReplaceNodeViewRequest {

    @ApiProperty({ type: 'file' })
    file?: any;

    static async getProps(
        request: ReplaceNodeViewRequest
    ): Promise<ReplaceNodeViewProps> {

        const file = request.file;
        
        const props: any = {
            file 
        }
        
        return props;
    }
}