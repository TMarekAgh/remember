import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppAuth, AppAuthSchema } from './schemas/app-auth.schema';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.registerAsync({
      imports: [ ConfigModule ],
      inject: [ ConfigService ],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('SECRET')
      })
    }),
    MongooseModule.forRootAsync({
      imports: [ ConfigModule ],
      inject: [ ConfigService ],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('DB_CONN')
      })    
    }),
    MongooseModule.forFeature([{ name: AppAuth.name, schema: AppAuthSchema }])
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
