import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ClientProxyFactory, ClientsModule, Transport } from "@nestjs/microservices";
import { AuthController } from "./controllers/auth.controller";
import { AuthService } from "./services/auth.service";

/**
 * Module handling API authorization in microservices 
 */
@Module({
    imports: [
        ConfigModule.forRoot({}),
        ClientsModule.register([])
    ],
    controllers: [AuthController],
    providers: [AuthService, {
        provide: 'APP_AUTH_SERVICE',
        useFactory: (configService: ConfigService) => {
            return ClientProxyFactory.create({
                transport: Transport.TCP,
                options: {
                    host: configService.get<string>('APP_AUTH_SERVICE_HOST'),
                    port: configService.get<number>('APP_AUTH_SERVICE_PORT')
                }
            })
        },
        inject: [ConfigService]
    }],
    exports: [AuthService, 'APP_AUTH_SERVICE']
})
export class AuthModule {}