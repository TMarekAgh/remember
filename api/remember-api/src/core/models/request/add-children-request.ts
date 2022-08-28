import { ApiProperty } from "@nestjs/swagger";

export class AddChildrenRequest {
    @ApiProperty()
    children: string[];
}