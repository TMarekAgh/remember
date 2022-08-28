import { ApiProperty } from "@nestjs/swagger";

export class LoginUserRequest {
    
    @ApiProperty()    
    username: string;
    
    @ApiProperty()    
    password: string;
}