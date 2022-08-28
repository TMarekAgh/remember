import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

/** Guard authenticating using passed credentials */
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}