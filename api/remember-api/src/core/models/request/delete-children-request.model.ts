import { ApiProperty } from "@nestjs/swagger";

export class DeleteChildrenRequest {
    @ApiProperty()
    children: string[];
}