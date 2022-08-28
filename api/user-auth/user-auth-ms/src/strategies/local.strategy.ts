import { Strategy } from 'passport-custom';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AppService } from 'src/app.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
    
    constructor(private appService: AppService) {
        super();    
    }

    async validate(req: { username: string, password: string }): Promise<any> {
        const user = await this.appService.validateUser(req.username, req.password);

        if(!user) {
            throw new UnauthorizedException();
        }

        return user;
    }

}