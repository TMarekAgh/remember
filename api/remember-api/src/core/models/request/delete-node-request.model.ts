import { ApiProperty } from "@nestjs/swagger";

export class DeleteNodeRequest {
    
    @ApiProperty()
    id: string;

    @ApiProperty()
    ids: string[] = [];

    @ApiProperty()
    cascade: boolean; 

    @ApiProperty()
    orphaned: boolean;

    @ApiProperty()
    reattach: boolean;

}