import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from './core/core.module';
import { AuthModule } from './user-auth/auth.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    ConfigModule.forRoot(), 
    AuthModule, 
    CoreModule, SharedModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
