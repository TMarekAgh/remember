import { ApiProperty } from "@nestjs/swagger";

export class RefreshTokenRequest {
    @ApiProperty()
    token: string;
}