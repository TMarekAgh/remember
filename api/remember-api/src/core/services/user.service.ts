import { Model } from 'mongoose';
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { UserAssociation, UserAssociationDocument } from '../schemas/user-associations.schema';
import { distinct, except } from 'src/util/array';
import { AuthService as UserAuthService, FilterUsersProps } from 'src/user-auth/services/auth.service';

@Injectable()
export class UserService {
    constructor(
        private authService: UserAuthService,
        @InjectModel(UserAssociation.name) private userAssociationModel: Model<UserAssociationDocument>
    ) {}

    public async initUserAssociations(userId: string) {
        const result = await this.userAssociationModel.create({ 
            userId, 
            associated: [] 
        })

        return result;
    }

    public async getUserAssociations(userId: string) {
        const result = await this.userAssociationModel.findOne({ userId });

        return result;
    }

    public async addUserAssociation(userId: string, association: string) {
        return await this.addUserAssociations(userId, [association])
    }

    public async addUserAssociations(userId: string, associations: string[]) {
        const data = await this.getUserAssociations(userId);

        data.associated = distinct([...data.associated, ...associations]);

        const result = await data.save()

        return true;
    }

    public async removeUserAssociation(userId: string, association: string) {
        return await this.removeUserAssociations(userId, [association])
    }

    public async removeUserAssociations(userId: string, associations: string[]) {
        const data = await this.getUserAssociations(userId);

        data.associated = except(data.associated, associations);
        
        const result = await data.save();

        return true;
    }

    public async getAssociatedUsers(userId: string) {
        const data = await this.getUserAssociations(userId);

        if(!data) throw new Error('There is no data for requested user');

        const userIds = data.associated;

        const users = await this.authService.getUsers(userIds);

        return users;
    }

    public async filter(props: FilterUsersProps) {
        const data = await this.authService.filter(props);

        return data;
    }
}
