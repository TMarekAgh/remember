import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/user-auth/guards/jwt-auth.guard";
import { AddTagRequest } from "../models/request/tags/add-tag.request";
import { FilterTagsRequest } from "../models/request/tags/filter-tags.request";
import { UpdateTagRequest } from "../models/request/tags/update-tag.request";
import { TagsService } from "../services/tags.service";

@Controller('/tags')
@UseGuards(JwtAuthGuard)
export class TagsController {
    
    constructor(
        private tagsService: TagsService
    ) {}

    @Get('/:id')
    async getTag(@Param('id') id: string) {
        const tag = await this.tagsService.getTag(id);

        return tag;
    }

    @Post('many')
    async getMany(@Req() request, @Body() body: { ids: string[] }) {
        const tags = await this.tagsService.getTags(body.ids);

        return tags;
    }

    @Post('')
    async addTag(@Req() request, @Body() body: AddTagRequest[]) {
        const tags = await this.tagsService.addTags(body, request.user.id);

        return tags[0] ?? null;
    }

    @Delete('/:id')
    async deleteTag(@Param('id') id: string) {
        const removed = await this.tagsService.deleteTag({ id });

        return removed;
    }

    @Patch('/:id')
    async updateTag(@Param('id') id: string, @Body() request: UpdateTagRequest) {
        const updated = await this.tagsService.updateTag({ id, name: request.name });

        return updated;
    }

    @Post('/filter')
    async filterTags(@Body() request: FilterTagsRequest) {
        const props = FilterTagsRequest.getProps(request);

        const filtered = await this.tagsService.filterTags(props);

        return filtered;
    }
}