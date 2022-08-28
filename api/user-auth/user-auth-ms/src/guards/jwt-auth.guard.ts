import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

/**
 * Guard used to verify and validate user authentication token
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}