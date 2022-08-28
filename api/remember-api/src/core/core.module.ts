import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/user-auth/auth.module';
import { AuthGateway } from 'src/user-auth/gateways/auth.gateway';
import { NodeController } from './controllers/node.controller';
import { TagsController } from './controllers/tags.controller';
import { UserDataController } from './controllers/user-data.controller';
import { UserController } from './controllers/user.controller';
import { SyncGateway } from './gateways/sync.gateway';
import { Node, NodeSchema } from './schemas/node.schema';
import { Tag, TagSchema } from './schemas/tag.schema';
import { UserAssociation, UserAssociationSchema } from './schemas/user-associations.schema';
import { UserData, UserDataSchema } from './schemas/user-data.schema';
import { NodeService } from './services/node.service';
import { TagsService } from './services/tags.service';
import { UserDataService } from './services/user-data.service';
import { UserService } from './services/user.service';

@Module({
  imports: [
      ConfigModule.forRoot(),
      MongooseModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: async (configService: ConfigService) => ({
            uri: configService.get<string>('DB_CONN')
          })
      }),
      MongooseModule.forFeature([{
        name: Node.name,
        schema: NodeSchema
      }, {
        name: Tag.name,
        schema: TagSchema
      }, {
        name: UserData.name,
        schema: UserDataSchema
      }, {
        name: UserAssociation.name,
        schema: UserAssociationSchema
      }]),
      AuthModule,
      EventEmitterModule.forRoot()
    ],     
  controllers: [
    NodeController,
    TagsController,
    UserDataController,
    UserController
  ],
  providers: [
    AuthGateway,
    NodeService,
    TagsService,
    UserDataService,
    SyncGateway,
    UserService
  ],
})
export class CoreModule {}
