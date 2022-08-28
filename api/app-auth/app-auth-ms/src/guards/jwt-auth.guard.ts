import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

/** Guard authenticating application using passed JWT token */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}