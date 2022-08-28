import { Strategy } from 'passport-custom';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { AuthSource } from 'src/enums/auth-source.enum';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {

    constructor(private authService: AuthService) {
        super()
    }

    async validate(payload: { code: string }) {
        const result = await this.authService.getGithubToken(payload.code);
        const gitUser = await this.authService.getGithubUserData(result);
        const user = await this.authService.findOrCreateByAssociation(AuthSource.Github, gitUser.id, gitUser);

        return user;
    }
}