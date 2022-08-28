import { ApiProperty } from "@nestjs/swagger";

export class RegisterRequest {
    
    username: string;

    password: string;

    email: string;
}