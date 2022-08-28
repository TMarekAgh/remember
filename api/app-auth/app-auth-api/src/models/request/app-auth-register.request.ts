import { ApiProperty } from "@nestjs/swagger";

export class AppAuthRegisterRequest {

    @ApiProperty()
    public name: string;
}