import { ApiProperty } from "@nestjs/swagger";

export class RegisterUserRequest {
    
    @ApiProperty()
    username: string;

    @ApiProperty()
    password: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    displayName: string;
}