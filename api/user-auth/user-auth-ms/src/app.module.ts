import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { AppAuthGuard } from './guards/app-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UserAuthAssoc, UserAuthAssocSchema } from './schemas/user-auth-assoc.schema';
import { User, UserSchema } from './schemas/user.schema';
import { AppAuthStrategy } from './strategies/app-auth.strategy';
import { GithubStrategy } from './strategies/github.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { UsersService } from './users/users.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    HttpModule,
    MongooseModule.forRootAsync({
      imports: [ ConfigModule ],
      inject: [ ConfigService ],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('DB_CONN')
      })
    }),
    MongooseModule.forFeature([
      { name: UserAuthAssoc.name, schema: UserAuthAssocSchema }
    ]),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema }
    ]),
    JwtModule.registerAsync({
      imports: [ ConfigModule ],
      inject: [ ConfigService ],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'), 
        signOptions: { 
          expiresIn: config.get<string>('JWT_EXPIRATION') 
        } 
      }) 
    })
  ],
  controllers: [AppController],
  providers: [
    AppService,
    UsersService,
    AuthService,
    JwtAuthGuard,
    JwtStrategy,
    LocalStrategy,
    GithubStrategy, 
    AppAuthStrategy,
    AppAuthGuard, {
      provide: 'APP_AUTH_SERVICE',
      useFactory: (configService: ConfigService) => {
          return ClientProxyFactory.create({
              transport: Transport.TCP,
              options: {
                  host: configService.get<string>('APP_AUTH_HOST'),
                  port: configService.get<number>('APP_AUTH_PORT')
              }
          })
      },
      inject: [ConfigService]
    }
  ],
})
export class AppModule {}
