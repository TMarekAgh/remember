import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

/** Guard authenticating based on JWT token */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}