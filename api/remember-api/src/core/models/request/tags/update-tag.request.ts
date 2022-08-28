import { ApiProperty } from "@nestjs/swagger";

export class UpdateTagRequest {
    
    @ApiProperty()
    name: string;
    
}