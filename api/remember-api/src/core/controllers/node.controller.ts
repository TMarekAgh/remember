import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Req, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { ApiConsumes } from "@nestjs/swagger";
import { NodeProjection, NodeResponse } from "@remember/api-common";
import { JwtAuthGuard } from "src/user-auth/guards/jwt-auth.guard";
import { AddChildrenRequest } from "../models/request/add-children-request";
import { AddLinksRequest } from "../models/request/add-links-request.model";
import { AddParentsRequest } from "../models/request/add-parents-request.model";
import { CreateNodeRequest } from "../models/request/create-node-request.model";
import { DeleteChildrenRequest } from "../models/request/delete-children-request.model";
import { DeleteNodeRequest } from "../models/request/delete-node-request.model";
import { FilterNodesRequest } from "../models/request/filter-nodes-request.model";
import { defaultAdjacentProjection, defaultNodeProjection, GetNodeRequest } from "../models/request/get-node-request.model";
import { GetNodesRequest } from "../models/request/get-nodes-request.model";
import { RemoveLinksRequest } from "../models/request/remove-links-request.model";
import { RemoveParentsRequest } from "../models/request/remove-parents-request.model";
import { ReplaceNodeContentRequest } from "../models/request/replace-content-request";
import { UpdateNodeRequest } from "../models/request/update-node-request.model";
import { DeleteNodeProps, DeleteNodesProps, NodeService } from "../services/node.service";

@Controller('/node')
@UseGuards(JwtAuthGuard)
export class NodeController {

    constructor(private nodeService: NodeService) {}

    @Post()    
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FilesInterceptor('file'))
    @UseGuards(JwtAuthGuard)
    async createNode(
        @Req() req: any,
        @Body() request: CreateNodeRequest, 
        @UploadedFiles() files: Express.Multer.File[]
    ) {
        const userId = req.user.id;
        const props = await CreateNodeRequest.getProps(request, files, userId);

        console.log('Files');
        console.log(files);
        
        const result = await this.nodeService.createNodeTree(props, userId);

        return NodeResponse.minified(result);
    }

    @Patch()
    @UseGuards(JwtAuthGuard)
    async updateNode(
        @Req() req: any,
        @Body() request: UpdateNodeRequest
    ) {
        await this.nodeService.checkPermissions(request.id, req.user.id);

        const props = UpdateNodeRequest.getProps(request);
        
        const result = await this.nodeService.updateNode(props);

        return NodeResponse.minified(result);
    }

    @Delete('/:id')
    @UseGuards(JwtAuthGuard)
    async deleteNode(
        @Param('id') id: string, 
        @Req() req: any, 
        @Body() request: DeleteNodeRequest
    ) {
        await this.nodeService.checkPermissions(id, req.user.id);

        request.id = id;
        
        const props = DeleteNodeProps.getProps(request);
        
        const result = await this.nodeService.removeNode(props);

        return NodeResponse.minified(result as any);
    }

    @Delete()
    @UseGuards(JwtAuthGuard)
    async deleteNodes(
        @Req() req: any,
        @Body() request: DeleteNodeRequest
    ) {

        const props = DeleteNodesProps.getProps(request);

        const result = await this.nodeService.removeNodes(props);
        
        return result.map(res => NodeResponse.minified(res as any));
    }

    @Post('/filter')
    @UseGuards(JwtAuthGuard)
    async filterNodes(
        @Req() req: any,
        @Body() request: FilterNodesRequest & GetNodeRequest
    ) {
        const props = FilterNodesRequest.getProps(request);
        
        const nodes = await this.nodeService.filterNodes(props, req.user.id);
    
        return nodes.map(x => NodeResponse.project(x, request.project));
    }

    @Post('/nodes')
    @UseGuards(JwtAuthGuard)
    async getNodes(
        @Req() req: any,
        @Body() request: GetNodesRequest
    ) {
        const nodes = await this.nodeService.getNodesById(request.ids, req.user.id);
        
        return nodes.map(x => NodeResponse.project(x, NodeProjection.Minified));
    }

    @Post('/:id')
    @UseGuards(JwtAuthGuard)
    async getNode(
        @Param('id') id: string,
        @Req() req: any,
        @Body() request: GetNodeRequest
    ) {
        await this.nodeService.checkPermissions(id, req.user.id);

        const props = GetNodeRequest.getProps(request);
        const project = request.project ?? defaultNodeProjection;
        const projectAdjacent = request.projectAdjacent ?? defaultAdjacentProjection;
        const data = await this.nodeService.getNodeById(id, props);

        const response: any = {
            node: NodeResponse.project(data.node, project),
        }

        if(props.getAdjacent) 
            response.adjacent = {
                parents: data.adjacent.parents.map(x => NodeResponse.project(x, projectAdjacent)),
                children: data.adjacent.children.map(x => NodeResponse.project(x, projectAdjacent)),
                links: data.adjacent.links.map(x => NodeResponse.project(x, projectAdjacent))
            } 
        
        return response;
    }

    @Get('/:id/content')
    @UseGuards(JwtAuthGuard)
    async getNodeContent(
        @Param('id') id: string,
        @Req() req: any,
    ) {
        await this.nodeService.checkPermissions(id, req.user.id);
        const file = await this.nodeService.getNodeContent(id);

        return file;
    }

    @Delete('/:id/content')    
    @UseInterceptors(FilesInterceptor('file'))
    @UseGuards(JwtAuthGuard)
    async deleteNodeContent(
        @Param('id') id: string,
        @Req() req: any,
    ) {
        await this.nodeService.checkPermissions(id, req.user.id);
        const file = await this.nodeService.deleteNodeContent(id);

        return file;
    }

    @Put('/:id/content')    
    @UseInterceptors(FilesInterceptor('file'))
    @ApiConsumes('multipart/form-data')
    @UseGuards(JwtAuthGuard)
    async replaceNodeContent(
        @Param('id') id: string,
        @UploadedFiles() files: Express.Multer.File[],
        @Req() req: any,
        @Body() body: ReplaceNodeContentRequest
    ) {
        await this.nodeService.checkPermissions(id, req.user.id);
        const props = await ReplaceNodeContentRequest.getProps(body, files, req.user.id);

        const file = await this.nodeService.replaceContent(id, props);

        return file;
    }

    @Get('/:id/view')
    @UseGuards(JwtAuthGuard)
    async getNodeView(
        @Param('id') id: string,
        @Req() req: any,
    ) {
        await this.nodeService.checkPermissions(id, req.user.id);
        const file = await this.nodeService.getNodeView(id);

        return file;
    }

    @Delete('/:id/view')
    @UseGuards(JwtAuthGuard)
    async deleteNodeView(
        @Param('id') id: string,
        @Req() req: any,
    ) {
        await this.nodeService.checkPermissions(id, req.user.id);
        const result = await this.nodeService.deleteNodeView(id);

        return result;
    }

    @Put('/:id/view')    
    @UseInterceptors(FilesInterceptor('file'))
    @ApiConsumes('multipart/form-data')
    @UseGuards(JwtAuthGuard)
    async replaceNodeView(
        @Param('id') id: string,
        @UploadedFiles() files: Express.Multer.File[],
        @Req() req: any,
        @Body() body: ReplaceNodeContentRequest
    ) {
        await this.nodeService.checkPermissions(id, req.user.id);
        const props = await ReplaceNodeContentRequest.getProps(body, files, req.user.id);

        const file = await this.nodeService.replaceNodeView(id, props);

        return file;
    }

    @Delete('/:id/links')
    async removeLinks(
        @Param('id') id: string, 
        @Req() req: any,
        @Body() request: RemoveLinksRequest
    ) {
        await this.nodeService.checkPermissions(id, req.user.id);
        const result = await this.nodeService.removeLinks(id, request.links);

        return true;
    }

    @Post('/:id/links')
    async addLinks(
        @Param('id') id: string, 
        @Req() req: any,
        @Body() request: AddLinksRequest
    ) {
        await this.nodeService.checkPermissions(id, req.user.id);
        const result = await this.nodeService.addLinks(id, request.links);

        return true;
    }

    @Delete('/:id/parents')
    async removeParents(
        @Param('id') id: string, 
        @Req() req: any,
        @Body() request: RemoveParentsRequest
    ) {
        await this.nodeService.checkPermissions(id, req.user.id);
        const result = await this.nodeService.removeParents(id, request.parents);

        return true;
    }

    @Post('/:id/parents')
    async addParents(
        @Param('id') id: string, 
        @Req() req: any,
        @Body() request: AddParentsRequest
    ) {
        await this.nodeService.checkPermissions(id, req.user.id);
        const result = await this.nodeService.addParents(id, request.parents);

        return true;
    }

    @Delete('/:id/children')
    async deleteChildren(
        @Param('id') id: string, 
        @Req() req: any,
        @Body() request: DeleteChildrenRequest
    ) {
        await this.nodeService.checkPermissions(id, req.user.id);
        const result = await this.nodeService.removeChildren(id, request.children);

        return result;
    }

    /**
     * Used to add existing nodes as children
     * @param id Id of the context node
     * @param request 
     * @returns 
     */
    @Post('/:id/children')
    async addChildren(
        @Param('id') id: string, 
        @Req() req: any,
        @Body() request: AddChildrenRequest,
    ) {        
        await this.nodeService.checkPermissions(id, req.user.id);
        const result = await this.nodeService.addChildren(id, request.children);

        return true;
    }

    @Post('/:id/tags')
    async addTags(
        @Param('id') id: string,
        @Req() req: any,
        @Body() request: AddTagsRequest
    ) {
        await this.nodeService.checkPermissions(id, req.user.id);
        const result = await this.nodeService.addTags(id, request.tags)

        return true;
    }

    @Delete('/:id/tags')
    async removeTags(
        @Param('id') id: string,
        @Req() req: any,
        @Body() request: AddTagsRequest //RemoveTags
    ) {
        await this.nodeService.checkPermissions(id, req.user.id);
        const result = await this.nodeService.removeTags(id, request.tags);

        return true;
    }

    @Put('/:id/tags')
    async editTags(
        @Param('id') id: string,
        @Req() req: any,
        @Body() request: AddTagsRequest //EditTags
    ) {
        await this.nodeService.checkPermissions(id, req.user.id);
        const result = await this.nodeService.replaceTags(id, request.tags);

        return true;
    }
}

export type AddTagsRequest = {
    tags: string[];
}