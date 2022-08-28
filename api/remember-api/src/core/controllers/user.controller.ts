import { Body, Controller, Delete, Get, Post, Req, UseGuards } from '@nestjs/common';
import { request } from 'http';
import { JwtAuthGuard } from 'src/user-auth/guards/jwt-auth.guard';
import { FilterUsersRequest } from '../models/request/users/filter-users.request';
import { UserService } from '../services/user.service';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
    constructor(private userService: UserService) {}

    @Get('associated') 
    public async getAssociatedUsers(@Req() request) {
        const result = await this.userService.getAssociatedUsers(request.user.id);

        return result;
    }

    @Post('associated')
    public async addAssociation(@Req() request, @Body() body: { userId: string }) {
        const result = await this.userService.addUserAssociations(request.user.id, [body.userId]);

        return result;
    }

    @Delete('associated')
    public async removeAssociation(@Req() request, @Body() body: { userId: string }) {
        const result = await this.userService.removeUserAssociations(request.user.id, [body.userId]);

        return result;
    }

    @Post('filter')
    public async filterUsers(@Req() request, @Body() body: FilterUsersRequest) {

        const props = FilterUsersRequest.getProps(body);
        
        const result = await this.userService.filter(props)

        return result;
    }
}

