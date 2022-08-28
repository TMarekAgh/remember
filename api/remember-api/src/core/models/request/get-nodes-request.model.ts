import { ApiProperty } from "@nestjs/swagger";

export class GetNodesRequest {
    @ApiProperty()
    ids: string[]   
}