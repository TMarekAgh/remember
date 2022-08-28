import { ApiProperty } from "@nestjs/swagger";

export class AppAuthRequest {
    
    @ApiProperty()
    auth: {
        token: string;
    }
}