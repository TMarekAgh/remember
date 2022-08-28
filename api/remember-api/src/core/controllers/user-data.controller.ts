import { Controller, Get, Param } from "@nestjs/common";
import { UserDataService } from "../services/user-data.service";

@Controller('/user-data')
export class UserDataController {
    constructor(private userDataService: UserDataService) {}

    @Get('/:id')
    async getUserData(@Param('id') id: string) {
        const data = await this.userDataService.getUserData(id);

        return data;
    }
}