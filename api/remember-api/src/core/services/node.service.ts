import { Model, Types } from 'mongoose';
import { HttpException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { NodeDocument, Node, CreateNodeTree } from "../schemas/node.schema";
import { UpdateNodeProps } from '../models/update-node.model';
import { FilterNodesProps } from '../models/filter-nodes.model';
import { GetNodeProps } from '../models/get-node.model';
import { ContentHandler } from '../classes/content-handler';
import { NodeType } from '../enums/node-type.enum';
import { SyncGateway } from '../gateways/sync.gateway';
import { distinct, except } from 'src/util/array';
import { asObjectId, objectIdsEqual } from 'src/util/mongo';
import { CreateNodeProps } from '../models/props/node/create-node.props';
import { OnEvent } from '@nestjs/event-emitter';
import { DeleteNodeRequest } from '../models/request/delete-node-request.model';
import { NodeContentType } from '../enums/node-content-type.enum';
import { ReplaceNodeContentProps } from '../models/props/node/replace-node-content.props';

@Injectable()
export class NodeService {
    constructor(
        @InjectModel(Node.name) private nodeModel: Model<NodeDocument>,
        private sync: SyncGateway
    ) {}

    //creates new node
    async createNode(props: CreateNodeProps, userId: string) {

        if(props.type == NodeType.File || props.type == NodeType.View)
            await ContentHandler.saveContent(props.contentType, props.contentData);

        const node = await this.nodeModel.create({
            ...props,
        });

        const parents = await this.getNodesById(props.parents, userId);

        for(const p of parents) {
            p.nodeChildren = [...p.nodeChildren, node._id];            
        }

        const updatedParents = await this.nodeModel.bulkSave(parents);

        node.nodeParents = parents.map(x => x._id);

        return node;
    }

    async createNodes(props: CreateNodeProps[]) {
        
        for(const prop of props)
            await ContentHandler.saveContent(prop.contentType, prop.contentData);

        const nodes = await this.nodeModel.create([...props.map(prop => ({ ...prop }))]);
    
        return nodes;
    }

    async createNodeTree(props: CreateNodeProps & CreateNodeTree, userId: string) {
        
        let children;

        if(props.childrenProps && props.childrenProps.length > 0) {
            children = await this.createNodeTrees(props.childrenProps, userId);
            props.children.push(children.map(x => x._id));
        }

        const node = await this.createNode(props, userId);

        return node;
    }

    async createNodeTrees(props: (CreateNodeProps & CreateNodeTree)[], userId: string) {
        const nodes = [];

        for(const prop of props) {
            nodes.push(await this.createNodeTree(prop, userId));
        }

        return nodes;
    }

    async removeNode(props: DeleteNodeProps) {
        const node = await this.nodeModel.findById(props.id);

        if(!node) throw new HttpException('Node not found', 404);
        
        node.remove(); //remove node

        if(node.type == NodeType.File || node.type == NodeType.View)
        await ContentHandler.deleteContent(node.contentType, node.contentData);
        
        if(props.cascade && props.orphaned) { 
            const nodes = await this.removeOrphaned(props.id, { ...props, ids: node.nodeChildren})

            const result = [node, ...nodes];

            result.forEach(x => this.sync.onObjectModified(x.id));

            return result;
        } else if(props.cascade) {
            const nodes = await this.removeNodes({ ...props, ids: node.nodeChildren });
            
            const result = [node, ...nodes];

            result.forEach(x => this.sync.onObjectModified(x.id));

            return result;
        } else if(props.reattach) {

        }

        this.sync.onObjectModified(node.id);

        return node;
    }

    async removeOrphaned(parentId: string, props: DeleteNodesProps) {
        const nodes = await this.nodeModel.find({ _id: { $in: props.ids.map(x => new Types.ObjectId(x)) } });        
    
        nodes.filter(x => x.nodeParents.length == 1 && x.nodeParents[0] == parentId);

        const results: NodeDocument[] = []

        for(const node of nodes) {
            if(!node.removable) continue;
            results.push(await node.remove())

            if(node.contentData)
                await ContentHandler.deleteContent(node.contentType, node.contentData);
        }

        if(props.cascade) {
            const children = [];

            for(const node of nodes) {
                children.push(...node.nodeChildren);
            }

            results.push(...await this.removeNodes({ ...props, ids: children }));
        }

        return results;
    }

    async reattachOrphaned(parentId: string, props: DeleteNodesProps) {
        const nodes = await this.nodeModel.find({ _id: { $in: props.ids.map(x => new Types.ObjectId(x)) } });        
    
        nodes.filter(x => x.nodeParents.length == 1 && x.nodeParents[0] == parentId);

        const results: NodeDocument[] = []

        // Reattach orphaned children to selected parents

        return results;
    }

    async removeNodes(props: DeleteNodesProps) {
        const nodes = await this.nodeModel.find({ _id: { $in: props.ids.map(x => new Types.ObjectId(x)) } });        
                
        const results: NodeDocument[] = []

        for(const node of nodes) {
            if(!node.removable) continue;
            results.push(await node.remove())

            if(node.contentData)
                await ContentHandler.deleteContent(node.contentType, node.contentData);
        }

        if(props.cascade) {
            const children = [];

            for(const node of nodes) {
                children.push(...node.nodeChildren);
            }

            results.push(...await this.removeNodes({ ...props, ids: children }));
        }

        return results;
    }

    //update node
    async updateNode(props: UpdateNodeProps) {
        const node = await this.nodeModel.findById(props.id);

        if(props.name) node.name = props.name;
        if(props.description) node.description = props.description;
        if(props.links) node.nodeLinks = props.links;
        if(props.children) node.nodeChildren = props.children;
        if(props.type) node.type = props.type;
        if(props.tags) node.tags = props.tags;
        if(props.permissions) node.permissions = props.permissions;

        const result = await node.save();

        this.sync.onObjectModified(props.id);

        return result;
    }

    async getNodeById(id: string, props: GetNodeProps) {
        
        let adjacent = null;

        const project = props.project ?? null;

        const node = await this.nodeModel.findById(id, project);

        if(props.getAdjacent) {
            const children = await this.nodeModel.find({ _id: { $in: node.nodeChildren.map(x => new Types.ObjectId(x)) }}, props.projectAdjacent);
            const links = await this.nodeModel.find({ _id: { $in: node.nodeLinks.map(x => new Types.ObjectId(x)) }}, props.projectAdjacent);
            const parents = await this.nodeModel.find({ nodeChildren: node._id }, props.projectAdjacent);

            adjacent = { parents, children, links }; 
        }

        return { node, adjacent };
    }

    async getNodesById(ids: string[], userId: string) {
        const nodes = await this.nodeModel.find({ 
            _id: { $in: ids.map(x => new Types.ObjectId(x)) }, 
            permissions: userId 
        });
        
        return nodes
    }

    async filterNodes(props: FilterNodesProps, userId: string) {
        const filterProps: any = {};
        
        if(props.id) filterProps._id = props.id;
        if(props.name) filterProps.name = props.name;
        if(props.subtype) filterProps.subtype = props.subtype;
        if(props.type) filterProps.type = props.type;
        if(props.creator) filterProps.creatorId = props.creator;
        if(props.tags) filterProps.tags = props.tags;

        filterProps.permissions = userId;

        const result = await this.nodeModel.find(filterProps);

        return result;
    }

    async getNodeContent(id: string) {
        const node = await this.nodeModel.findById(id);

        if(!node.contentData) 
            throw new HttpException('There is no content for selected node', 404);

        const content = await ContentHandler.getContent(node.contentType, node.contentData);

        return content;
    }

    async deleteNodeContent(id: string) {
        const node = await this.nodeModel.findById(id);

        await ContentHandler.deleteContent(node.contentType, node.contentData);

        node.contentData = null;

        await node.save();

        return node;
    }

    async replaceContent(id: string, props: ReplaceNodeContentProps) {
        const node = await this.nodeModel.findById(id);

        const contentData = {
            ...props.contentData
        } 

        if(node.contentData?.file) {
            contentData.file = node.contentData.file;
        }

        await ContentHandler.replaceContent(props.contentType, contentData)

        node.contentData = contentData;

        await node.save();

        return node;
    }

    // View

    async getNodeView(id: string) {
        const node = await this.nodeModel.findById(id);

        const view = await this.nodeModel.findOne({ _id: { 
            $in: node.nodeChildren.map(x => new Types.ObjectId(x)),             
            }, 
            type: 3 
        });

        if(!view) throw new NotFoundException('There is no view corresponding to this node');

        const content = await this.getNodeContent(view._id);

        return content;
    }

    async deleteNodeView(id: string) {
        const node = await this.nodeModel.findById(id);

        const view = await this.nodeModel.findOne({ _id: { 
            $in: node.nodeChildren.map(x => new Types.ObjectId(x)),             
            }, 
            type: 3 
        });

        if(!view) throw new NotFoundException('There is no view corresponding to this node');

        const result = await this.nodeModel.findByIdAndDelete(view._id);

        return result;
    }

    async replaceNodeView(id: string, props: ReplaceNodeContentProps) {
        const node = await this.nodeModel.findById(id);

        const view = await this.nodeModel.findOne({ _id: { 
            $in: node.nodeChildren.map(x => new Types.ObjectId(x)),             
            }, 
            type: NodeType.View
        });

        if(!view) throw new NotFoundException('There is no view corresponding to this node');

        const contentData = {
            ...props.contentData,
            file: view.contentData.file
        } 

        await ContentHandler.replaceContent(props.contentType, contentData)

        view.contentData = contentData;

        await view.save();

        return view;
    }

    async getParentsForNode(id: string) {
        const parents = await this.nodeModel.find({ nodeChildren: [id] }, { _id: 1}) as string[];

        return parents;
    }

    async getParentsForNodes(ids: string[]) {
        const result: { [key: string]: string[] } = {}

        for await (const id of ids)
            result[id] = await this.getParentsForNode(id)

        return result;
    }

    // LINKS
    
    async addLinks(id: string, ids: string[]) {
        const node = await this.nodeModel.findById(id);

        node.nodeLinks = distinct([...node.nodeLinks, ...ids.map(asObjectId)]);

        const result = await node.save();

        this.sync.onObjectModified(id);

        return result;
    }

    async removeLinks(id: string, ids: string[]) {
        const node = await this.nodeModel.findById(id);

        node.nodeLinks = except(node.nodeLinks, ids.map(asObjectId), objectIdsEqual);

        const result = await node.save();

        this.sync.onObjectModified(id);

        return result;
    }

    // PARENTS 

    async addParents(id: string, ids: string[]) {
        const parents = await this.nodeModel.find({ 
            _id: { $in: ids.map(x => new Types.ObjectId(x)) }
        });

        for(const parent of parents) {
            parent.nodeChildren = distinct([...parent.nodeChildren, asObjectId(id)])
        }

        const result = this.nodeModel.bulkSave(parents);

        return result;
    }


    async removeParents(id: string, ids: string[]) {
        const parents = await this.nodeModel.find({ 
            _id: { $in: ids.map(x => new Types.ObjectId(x)) }
        });

        for(const parent of parents) {
            parent.nodeChildren = except(parent.nodeChildren, [id].map(asObjectId), objectIdsEqual)
        }

        const result = this.nodeModel.bulkSave(parents);

        return result;
    }

    // Children

    async addChildren(id: string, children: string[]) {
        const node = await this.nodeModel.findById(id);

        node.nodeChildren = distinct([
            ...node.nodeChildren, 
            ...children.map(asObjectId)
        ]);

        const result = await node.save();

        return result;
    }

    async removeChildren(id: string, ids: string[]) {
        const node = await this.nodeModel.findById(id);

        node.nodeChildren = except(node.nodeChildren, ids.map(asObjectId), objectIdsEqual);

        const result = await node.save();

        this.sync.onObjectModified(id);

        return result;
    }

    async addTags(id: string, tags: string[]) {
        const node = await this.nodeModel.findById(id);

        node.tags = distinct([
            ...node.tags, 
            ...tags.map(asObjectId)
        ]);

        const result = await node.save();

        this.sync.onObjectModified(id);

        return result;
    }

    async removeTags(id: string, tags: string[]) {
        const node = await this.nodeModel.findById(id);
        
        node.tags = except(node.tags, tags.map(asObjectId), objectIdsEqual)

        const result = await node.save();

        this.sync.onObjectModified(id);

        return result;
    }

    async replaceTags(id: string, tags: string[]) {
        const node = await this.nodeModel.findById(id);

        node.tags = tags;

        const result = await node.save();

        this.sync.onObjectModified(id);

        return result;
    }

    async addPermissions(id: string, userIds: string[]) {
        const node = await this.nodeModel.findById(id);

        node.permissions = distinct([
            ...node.permissions,
            ...userIds.map(asObjectId)
        ]);

        const result = await node.save();

        this.sync.onObjectModified(id);

        return result;
    }

    async removePermissions(id: string, currentUserId: string, userIds: string[]) {
        const node = await this.nodeModel.findById(id);

        // If permissions to remove contain current user id, skip it (user cannot remove his own permissions)
        userIds = userIds.filter(x => x != currentUserId);

        node.permissions = except(node.permissions, userIds.map(asObjectId), objectIdsEqual);

        const result = await node.save();

        this.sync.onObjectModified(id);

        return result;
    }

    async editPermissions(id: string, currentUserId: string, userIds: string[]) {
        const node = await this.nodeModel.findById(id);

        // If permissions to overwrite don't contain current user id, add it (user cannot remove his own permissions)
        userIds.push(currentUserId);

        node.permissions = userIds;

        const result = await node.save();

        this.sync.onObjectModified(id);

        return result;
    }

    async checkPermissions(nodeId: string, userId: string) {
        const node = await this.nodeModel.findById(nodeId);

        if(!node) throw new HttpException("Requested node doesn't exist", 404);

        if(!node.permissions.includes(userId) && node.creatorId != userId) 
            throw new HttpException("Insufficient permissions to access this node", 403);

        return true;
    } 

    @OnEvent('tag.deleted')
    async onTagDeleted(event: any) {
        const nodes = await this.nodeModel.find({ tags: event.id });

        nodes.forEach(x => x.tags = x.tags.filter(tag => tag != event.id));

        const result = await this.nodeModel.bulkSave(nodes);

        return result;
    }
}

export class DeleteNodeProps {
    id: string;
    cascade: boolean;
    orphaned: boolean;
    reattach: boolean;

    public static getProps(req: DeleteNodeRequest): DeleteNodeProps {
        return {
            id: req.id,
            cascade: req.cascade ?? false,
            orphaned: req.orphaned ?? false,
            reattach: req.reattach ?? false
        }
    }
}

export class DeleteNodesProps {
    ids: string[];
    cascade: boolean;
    orphaned: boolean;
    reattach: boolean;

    public static getProps(req: DeleteNodeRequest): DeleteNodesProps {
        const ids = req.ids ?? [];
        if(req.id) ids.push(req.id);
        return {
            ids,
            cascade: req.cascade ?? false,
            orphaned: req.orphaned ?? false,
            reattach: req.reattach ?? false
        }
    }
}