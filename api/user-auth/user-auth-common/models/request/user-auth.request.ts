export class UserAuthRequest {
    
    auth: {
        token: string;
    };

    user: {
        userId: string;
        username: string;
    };
}