import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppAuth, AppAuthSchema } from './schemas/app-auth.schema';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ ConfigModule ],
      inject: [ ConfigService ],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('SECRET')
      })
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>("DB_CONN")
      }),
      inject: [ConfigService]
    }),
    MongooseModule.forFeature([
      { 
        name: AppAuth.name, 
        schema: AppAuthSchema }
    ])
  ],
  controllers: [AppController],
  providers: [
    AppService, 
    LocalStrategy, 
    JwtStrategy
  ],
})
export class AppModule {}
