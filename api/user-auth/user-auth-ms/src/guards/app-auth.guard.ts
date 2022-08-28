import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

/**
 * Guard used to verify presence and validity of application access token
 */
@Injectable()
export class AppAuthGuard extends AuthGuard('app') {}