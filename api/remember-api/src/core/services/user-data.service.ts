import { Model } from 'mongoose';
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { UserData, UserDataDocument } from '../schemas/user-data.schema';
import { NodeService } from './node.service';
import { NodeType } from '../enums/node-type.enum';
import { NodeSubType } from '../enums/node-subtype.enum';
import { CreateNodeProps } from '../models/props/node/create-node.props';
import { UserService } from './user.service';

@Injectable()
export class UserDataService {
    constructor(
        @InjectModel(UserData.name) private userDataModel: Model<UserDataDocument>,
        private userService: UserService,
        private nodeService: NodeService
    ) {}

    public async getUserData(id: string) {
        let data = await this.userDataModel.findOne({ userId: id });

        if(!data) {
            data = await this.createNewUserData(id);
        }

        return data;
    }

    public async createNewUserData(userId: string) {
        const rootNodeData: CreateNodeProps = {
            name: 'Root',
            description: 'Root of user data',
            parents: [],
            children: [],
            type: NodeType.Root,
            subtype: NodeSubType.Undefined,
            creatorId: userId,
            permissions: [userId],
            tags: [],
            removable: false,
            editable: false
        } 

        const node = await this.nodeService.createNode(rootNodeData, userId);

        const userData = new UserData({
            userId,
            rootNode: node._id
        });

        const userAssociations = await this.userService.initUserAssociations(userId);

        const result = await this.userDataModel.create(userData);

        return result;
    }
}
