import { ApiProperty } from "@nestjs/swagger";

export class AddTagRequest {

    @ApiProperty()
    name: string;
}