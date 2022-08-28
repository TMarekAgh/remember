import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { AuthModule as AppAuthModule } from './../app-auth/auth.module';
import { AuthService as AppAuthService } from './../app-auth/services/auth.service';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';

/**
 * Module used to handle user authentication.
 * Serves as a gateway for user auth microservice.
 */
@Module({
    imports: [
        ConfigModule.forRoot({}),
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                uri: configService.get<string>('DB_CONN')
            }),
        }),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        ClientsModule.registerAsync([
            {
                imports: [ConfigModule],
                inject: [ConfigService],
                name: 'USER_AUTH_SERVICE',
                useFactory: async (configService: ConfigService) => ({
                    name: 'USER_AUTH_SERVICE',
                    transport: Transport.TCP,
                    options: {
                        host: configService.get<string>('USER_AUTH_SERVICE_HOST'),
                        port: configService.get<number>('USER_AUTH_SERVICE_PORT')
                    }
                })
            }
        ]),
        AppAuthModule
    ],
    controllers: [
        AuthController
    ],
    providers: [
        AuthService,
        AppAuthService,
        JwtStrategy
    ],
    exports: [
        AuthService
    ]
})
export class AuthModule {}
