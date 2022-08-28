import { Location } from "@angular/common";
import { EventEmitter } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { CreateNodeRequest, INode, INodeResponse, NodeProjection } from "@nihil/remember-common";
import { lastValueFrom } from "rxjs";
import { AuthService } from "../../auth/services/auth.service";
import { SnackBarService } from "../../shared/services/snack-bar.service";
import { UserService } from "../../user/services/user.service";
import { NodeAction } from "../enums/node-action.enum";
import { NodeService } from "../services/node.service";
import { TagService } from "../services/tag.service";
import { UserDataService } from "../services/user-data.service";
import { AddChildrenComponent } from "../views/dialogs/add-children/add-children.component";
import { AddLinksComponent } from "../views/dialogs/add-links/add-links.component";
import { AddParentsComponent } from "../views/dialogs/add-parents/add-parents.component";
import { CreateNodeComponent } from "../views/dialogs/create-node/create-node.component";
import { DeleteNodeComponent } from "../views/dialogs/delete-node/delete-node.component";
import { EditNodeComponent } from "../views/dialogs/edit-node/edit-node.component";
import { PreviewNodeComponent } from "../views/dialogs/preview-node/preview-node.component";
import { Navigator } from './../classes/navigator';
import { Node } from './../models/node';

export class ViewerState {

  constructor(
    private nodeService: NodeService,
    private userService: UserService,
    private authService: AuthService,
    private userDataService: UserDataService,
    private tagService: TagService,
    private dialog: MatDialog,
    private snackService: SnackBarService,
    private router: Router,
    private location: Location
  ) {}

  /** The node that is currently set as main (center of graph) */
  currentNode!: Node;

  /** The node that is currently displayed (content, view) */
  activeNode: Node | null = null;

  nodeAction = new EventEmitter<NodeEvent>();

  /** Object used to track graph navigation history  */
  navigator = new Navigator();

  mouseEventActive = false;

  navigatedBack = false;

  isOwner = false;

  public init = async (nodeId?: string | null) => {
    const currentUser = await this.userService.getCurrentUser();

    if(!currentUser) return;

    const userId = currentUser.id;

    let data = this.userDataService.userData;

    if(!data)
      data = await this.userDataService.getUserData(userId);

    let res;
    if(nodeId)
      res = await this.getNode({ id: nodeId } as any)
    else
      res = await this.getNode({ id: data.rootNode } as any);

    this.activeNode = this.currentNode;
    this.navigator.add(this.currentNode.id);

    this.nodeAction.subscribe(ev => this.onNodeAction(ev))
  }

  nodeClicked(node: Node) {
    if(!this.isActive(node)) {
      this.setActive(node);
    } else if(this.currentNode != node) {
      this.navigateToNode(node.id);
    }
  }

  navigateToNode(id: string) {
    if(!this.navigatedBack) {
      this.navigator.add(id);
      this.navigatedBack = false;
    }
    this.getNode({ id } as any);
  }

  async getNode(node: Node) {
    const res = await this.nodeService.get(node.id, { getAdjacent: true });

    this.location.replaceState('/grapher/' + node.id);

    this.currentNode = Node.fromGetNodeResponse(res, NodeProjection.Minified, NodeProjection.Minified);

    const currentUser = await this.userService.getCurrentUser();

    this.isOwner = (this.currentNode as any).creatorId == currentUser.id;
  }

  isActive(node: Node) {
    return this.activeNode == node;
  }

  setActive(node: Node) {
    this.activeNode = node;
  }

  async onNodeAction(ev: NodeEvent) {
    switch(ev.action) {

      case NodeAction.Navigate:
        this.navigateToNode(ev.value);
        break;

      case NodeAction.Preview:
        this.openPreviewNode(ev.value);
        break;

      case NodeAction.OpenAddChildren:
        this.openAddChildren(ev.context ?? this.currentNode)
        break;
      case NodeAction.AddChildren:
        this.addChildren(ev.context, ev.value);
        break;
      case NodeAction.ChildrenAdded:
        this.onChildrenAdded(ev.context, ev.value)
        break;

      case NodeAction.NewChildAdded:
        this.onNewChildAdded(ev.context, ev.value)
        break;
      case NodeAction.NewChildAddedError:
        this.snackService.openError('There was an error while creating a new child');
        break;

      case NodeAction.OpenRemoveChildren:
        // this.openRemoveParents(ev.context ?? this.currentNode);
        break;
      case NodeAction.RemoveChildren:
        this.removeChildren(ev.context, ev.value);
        break;
      case NodeAction.ChildrenRemoved:
        this.onChildrenRemoved(ev.context, ev.value);
        break;

      case NodeAction.OpenAddParents:
        this.openAddParents(ev.context ?? this.currentNode)
        break;
      case NodeAction.AddParents:
        this.addParents(ev.context, ev.value);
        break;
      case NodeAction.ParentsAdded:
        this.onParentsAdded(ev.context, ev.value)
        break;

      case NodeAction.OpenRemoveParents:
        // this.openRemoveParents(ev.context ?? this.currentNode);
        break;
      case NodeAction.RemoveParents:
        this.removeParents(ev.context, ev.value);
        break;
      case NodeAction.ParentsRemoved:
        this.onParentsRemoved(ev.context, ev.value);
        break;

      case NodeAction.OpenAddLinks:
        this.openAddLinks(ev.context ?? this.currentNode);
        break;
      case NodeAction.AddLinks:
        this.addLinks(ev.context, ev.value);
        break;
      case NodeAction.LinksAdded:
        this.onLinksAdded(ev.context, ev.value)
        break;

      case NodeAction.OpenRemoveLinks:
        // this.openRemoveLinks(ev.context ?? this.currentNode);
        break;
      case NodeAction.RemoveLinks:
        this.removeLinks(ev.context, ev.value);
        break;
      case NodeAction.LinksRemoved:
        this.onLinksRemoved(ev.context, ev.value);
        break;

      case NodeAction.OpenAddNode:
        this.openAddNode(ev.context ?? this.currentNode)
        break;
      case NodeAction.AddNode:
        this.addNode(ev.value, ev.value.fileData)
        break;
      case NodeAction.NodeAdded:
        this.onNodeAdded(ev.value);
        break;

      case NodeAction.OpenEditNode:
        this.openEditNode(ev.value ?? this.activeNode)
        break;
      case NodeAction.EditNode:
        this.editNode(ev.value, ev.value?.fileData, ev.context)
        break;
      case NodeAction.NodeEdited:
        this.onNodeEdited(ev.value, ev.context)
        break;

      case NodeAction.OpenDeleteNode:
        this.openDeleteNode(ev.value);
        break;
      case NodeAction.DeleteNode:
        this.deleteNode(ev.value, ev.context);
        break;
      case NodeAction.NodeDeleted:
        this.onNodeDeleted(ev.value, ev.context);
        break;

      case NodeAction.OpenAddView:
        break;
      case NodeAction.AddView:
        this.addView(ev.value, ev.value.fileData, ev.context);
        break;
      case NodeAction.ViewAdded:
        this.onViewAdded(ev.value, ev.context);
        break;

      case NodeAction.OpenEditView:
        break;
      case NodeAction.EditView:
        this.editView(ev.value, ev.value.fileData, ev.context);
        break;
      case NodeAction.ViewEdited:
        this.onViewEdited(ev.value, ev.context);
        break;

      case NodeAction.ReplaceView:
        this.editView(ev.value, ev.value.fileData, ev.context);
        break;

      case NodeAction.RemoveView:
        this.deleteView(ev.value, ev.context);
        break;
      case NodeAction.ViewRemoved:
        this.onViewDeleted(ev.value, ev.context);
        break;

      case NodeAction.UploadContent:
        this.uploadContent(ev.value, ev.context, ev.value.fileData);
        break;
      case NodeAction.ContentUploaded:
        this.onContentUploaded(ev.value, ev.context);
        break;

      case NodeAction.DeleteContent:
        this.deleteContent(ev.value, ev.context);
        break;
      case NodeAction.ContentDeleted:
        this.onContentDeleted(ev.value, ev.context);
        break;
    }
  }

  //** Open node addition dialog */
  async openAddNode(context: Node) {
    const dialogRef = this.dialog.open(CreateNodeComponent, {
      width: '80%',
      data: { node: this.currentNode }
    })

    const result = await lastValueFrom(dialogRef.afterClosed());

    if(!result) return;

    this.nodeAction.emit({ action: NodeAction.ChildrenAdded, value: result, context });
  }

  //** Add node */
  async addNode(data: CreateNodeRequest, fileData: any) {
    try {
      const result = await this.nodeService.create(data, fileData);

      this.nodeAction.emit({ action: NodeAction.NodeAdded, value: result, context: null as any })
    } catch(err) {
      this.nodeAction.emit({ action: NodeAction.NodeAddError, value: err, context: null as any })
    }
  }

  //** Update current context based on whether the newly created node has any association with current node */
  async onNodeAdded(node: INodeResponse) {
    const mapped = Node.fromApiNode(node, NodeProjection.Minified) as Node;
    if(Node.isChild(mapped, this.currentNode)) {
      this.nodeAction.emit({
        action: NodeAction.ChildrenAdded,
        value: [mapped.id], //TODO optimize
        context: this.currentNode
      })
    } else if (Node.isParent(mapped, this.currentNode)) {
      this.nodeAction.emit({
        action: NodeAction.ParentsAdded,
        value: [mapped.id], //TODO optimize
        context: this.currentNode
      })
    } else if (Node.isLink(mapped, this.currentNode)) {
      this.nodeAction.emit({
        action: NodeAction.LinksAdded,
        value: [mapped.id], //TODO optimize
        context: this.currentNode
      })
    }

    this.snackService.openSuccess('Node added succesfully');
  }

  /** Open node editing dialog */
  async openEditNode(node: Node) {
    const dialogRef = this.dialog.open(EditNodeComponent, {
      width: '80%',
      data: { node }
    })

    const result = await lastValueFrom(dialogRef.afterClosed());

    if(!result) return;

  }

  //** Edit node */
  async editNode(data: any, fileData: any, context: Node) { //TODO Add update model for edit
    try {
      const result = await this.nodeService.update(data);

      this.nodeAction.emit({ action: NodeAction.NodeEdited, value: result, context: context });
    } catch(err) {
      this.nodeAction.emit({ action: NodeAction.NodeEditError, value: err, context: context });
    }
  }

  //** On node edited */
  async onNodeEdited(node: INodeResponse, nodeToUpdate: Node) {
    const mapped = Node.fromApiNode(node, NodeProjection.Minified) as Node;
    nodeToUpdate.name = mapped.name;
    nodeToUpdate.description = mapped.description;
    nodeToUpdate.childrenIds = mapped.childrenIds;
    nodeToUpdate.linkIds = mapped.linkIds;
    nodeToUpdate.parentIds = mapped.parentIds;
    nodeToUpdate.tagIds = mapped.tagIds;
    nodeToUpdate.permissions = mapped.permissions;
    nodeToUpdate.type = mapped.type;

    const nodeDependencies = await this.nodeService.getMany([
      ...nodeToUpdate.childrenIds,
      ...nodeToUpdate.parentIds,
      ...nodeToUpdate.linkIds
    ])

    const tags = await this.tagService.getTags([
      ...nodeToUpdate.tagIds
    ])

    nodeToUpdate.children = nodeDependencies.filter((x: any) =>
      nodeToUpdate.childrenIds.includes(x.id));
    nodeToUpdate.parents = nodeDependencies.filter((x: any) =>
      nodeToUpdate.parentIds.includes(x.id));
    nodeToUpdate.links = nodeDependencies.filter((x: any) =>
      nodeToUpdate.linkIds.includes(x.id));

    nodeToUpdate.tags = tags;

    this.snackService.openSuccess('Node edited succesfully');
  }

  /** Open node deletion dialog */
  async openDeleteNode(context: Node) {
    const dialogRef = this.dialog.open(DeleteNodeComponent, {
      width: '500px',
      data: { node: context }
    })

    const result = await lastValueFrom(dialogRef.afterClosed());

    if(!result) return;

  }

  async deleteNode(props: DeleteNodeRequest, context: Node) {
    try {
      const result = await this.nodeService.delete(props.id);

      this.nodeAction.emit({
        action: NodeAction.NodeDeleted,
        value: result,
        context,
      })
    } catch(ex) {
      this.nodeAction.emit({
        action: NodeAction.NodeDeleteError,
        value: ex,
        context: null as any
      })
    }
  }

  async onNodeDeleted(value: INodeResponse, context: Node) {
    if(this.currentNode == context) {

      if(this.navigator.hasPrevious) {
        this.navigator.remove(context.id);
        this.nodeService.state.navigatedBack = true;
        if(this.navigator.hasPrevious)
          this.navigator.previous();
        else this.getNode({ id: this.userDataService.userData.rootNode } as any);
      }

    } else if(this.activeNode == context) {
      this.setActive(this.currentNode);

      if(Node.isChild(context, this.currentNode)) {
        // this.currentNode.hasView = false;
        this.currentNode.childrenIds = this.currentNode.childrenIds.filter(x => x != context.id); //TODO optimize
        this.currentNode.children = [...this.currentNode.children.filter(x => x.id != context.id)];
      }

      this.snackService.openSuccess('Node removed succesfully');
    }
  }

  /** Open add children dialog */
  async openAddChildren(context: Node) {
    const dialogRef = this.dialog.open(AddChildrenComponent, {
      width: '500px',
      data: { node: this.currentNode }
    })

    const result = await lastValueFrom(dialogRef.afterClosed());

    if(!result) return;

    this.nodeAction.emit({ action: NodeAction.AddChildren, value: result, context });
  }

  async addChildren(context: Node, value: string[]) {
    try {
      const result = await this.nodeService.addChildren(context.id, value);

      this.nodeAction.emit({
        action: NodeAction.ChildrenAdded,
        value,
        context
      })

    } catch(err) {
      this.emitError(NodeAction.ChildrenAddError, value, context)
    }
  }

  async onNewChildAdded(context: Node, value: Node) {
    if(context != this.currentNode) return;

    this.currentNode.childrenIds.push(value.id);
    this.currentNode.children = [...this.currentNode.children, value];

    this.snackService.openSuccess('New child created succesfully');
  }

  /** Updates children in related node */
  async onChildrenAdded(node: Node, children: (string | Node)[]) {
    const existingChildrenIds = children.filter(x => typeof x === 'string') as string[];
    const newChildren = children.filter(x => x instanceof Object) as Node[];

    let existingChildren = existingChildrenIds.length > 0 ?
      await this.nodeService.getMany(existingChildrenIds) :
      [];

    if(!existingChildren) {
      this.snackService.openError('There was an error while retrieving newly added children.');
    }

    existingChildren = existingChildren.map((x: any) => Node.fromApiNode(x, NodeProjection.Minified));

    node.childrenIds = [...node.childrenIds, ...existingChildrenIds, ...newChildren.map(x => x.id)]
    node.children = [...node.children, ...existingChildren, ...newChildren];

    this.snackService.openSuccess('Children added succesfully');
  }

  // async openRemoveChildren() {}

  async removeChildren(context: Node, value: string[]) {
    try {
      const result = await this.nodeService.removeChildren(context.id, value);

      this.nodeAction.emit({
        action: NodeAction.ChildrenRemoved,
        value,
        context
      })

    } catch(err) {
      this.emitError(NodeAction.ChildrenRemoveError, value, context)
    }
  }

  /** Updates children in related node */
  async onChildrenRemoved(node: Node, children: string[]) {
    const removedChildren = await this.nodeService.removeChildren(node.id, children);

    if(!removedChildren) {
      this.snackService.openError('There was an error while removing children. Try again later.');
      return;
    }

    node.childrenIds = node.childrenIds.filter(x => !children.includes(x)); //TODO optimize
    node.children = [...node.children.filter(x => !children.includes(x.id))];

    this.snackService.openSuccess('Children removed succesfully');
  }

  /** Open add parents dialog */
  async openAddParents(context: Node) {
    const dialogRef = this.dialog.open(AddParentsComponent, {
      width: '500px',
      data: { node: this.currentNode }
    })

    const result = await lastValueFrom(dialogRef.afterClosed());

    if(!result) return;

    this.nodeAction.emit({ action: NodeAction.AddParents, value: result, context });
  }

  async addParents(context: Node, value: string[]) {
    try {
      const result = await this.nodeService.addParents(context.id, value);

      this.nodeAction.emit({
        action: NodeAction.ParentsAdded,
        value,
        context
      })

    } catch(err) {
      this.emitError(NodeAction.ParentsAddError, value, context)
    }
  }

  async onParentsAdded(node: Node, parents: string[]) {
    let newParents = await this.nodeService.getMany(parents);

    if(!newParents) {
      this.snackService.openError('There was an error while retrieving newly added parents. Try refreshing.');
      return;
    }

    newParents = newParents.map((x: any) => Node.fromApiNode(x, NodeProjection.Minified));

    node.parentIds = [...node.parentIds, ...parents];
    node.parents = [...node.parents, ...newParents];

    this.snackService.openSuccess('Parents added succesfully');
  }

  // async openRemoveParents() {}

  async removeParents(context: Node, value: string[]) {
    try {
      const result = await this.nodeService.removeParents(context.id, value);

      this.nodeAction.emit({
        action: NodeAction.ParentsRemoved,
        value,
        context
      })

    } catch(err) {
      this.emitError(NodeAction.ParentsRemoveError, value, context)
    }
  }

  async onParentsRemoved(node: Node, parents: string[]) {
    const removedParents = await this.nodeService.removeParents(node.id, parents);

    if(!removedParents) {
      this.snackService.openError('There was an error while removing parents. Try again later.');
      return;
    }

    node.parentIds = node.parentIds.filter(x => !parents.includes(x)); //TODO optimize
    node.parents = [...node.parents.filter(x => !parents.includes(x.id))];

    this.snackService.openSuccess('Parents removed succesfully');
  }

  /** Open add link dialog */
  async openAddLinks(context: Node) {
    const dialogRef = this.dialog.open(AddLinksComponent, {
      width: '500px',
      data: { node: this.currentNode }
    })

    const result = await lastValueFrom(dialogRef.afterClosed());

    if(!result) return;

    this.nodeAction.emit({ action: NodeAction.AddLinks, value: result, context });
  }

  async addLinks(context: Node, value: string[]) {
    try {
      const result = await this.nodeService.addLinks(context.id, value);

      this.nodeAction.emit({
        action: NodeAction.LinksAdded,
        value,
        context
      })

    } catch(err) {
      this.emitError(NodeAction.LinksAddError, err, context)
    }
  }

  async onLinksAdded(node: Node, links: string[]) {
    let newLinks = await this.nodeService.getMany(links);

    if(!newLinks) {
      this.snackService.openError('There was an error while retrieving newly created links. Try refreshing.');
      return;
    }

    newLinks = newLinks.map((x: any) => Node.fromApiNode(x, NodeProjection.Minified));

    node.linkIds = [...node.linkIds, ...links];
    node.links = [...node.links, ...newLinks];

    this.snackService.openSuccess('Links added succesfully');
  }

  // /** Open add link dialog */
  // async openRemoveLinks(context: Node) {
  //   const dialogRef = this.dialog.open(RemoveLinksComponent, {
  //     width: '500px',
  //     data: { node: this.currentNode }
  //   })

  //   const result = await lastValueFrom(dialogRef.afterClosed());

  //   if(!result) return;

  //   this.nodeAction.emit({ action: NodeAction.RemoveLinks, value: result, context });
  // }

  async removeLinks(context: Node, value: string[]) {
    try {
      const result = await this.nodeService.removeLinks(context.id, value);

      this.nodeAction.emit({
        action: NodeAction.LinksRemoved,
        value,
        context
      })

    } catch(err) {
      this.emitError(NodeAction.LinksRemoveError, err, context)
    }
  }

  async onLinksRemoved(node: Node, links: string[]) {
    const removedLinks = await this.nodeService.removeLinks(node.id, links);

    if(!removedLinks) {
      this.snackService.openError('There was an error while removing links. Try again later.');
      return;
    }

    node.linkIds = node.linkIds.filter(x => !links.includes(x)); //TODO optimize
    node.links = [...node.links.filter(x => !links.includes(x.id))];

    this.snackService.openSuccess('Links deleted succesfully');
  }

  async openPreviewNode(id: string) {
    const dialogRef = this.dialog.open(PreviewNodeComponent, {
      width: '500px',
      height: '500px',
      data: { id }
    })
  }

  //** Add view */
  async addView(data: CreateNodeRequest, fileData: any, context: Node) {
    try {
      const result = await this.nodeService.create(data, fileData);

      this.nodeAction.emit({ action: NodeAction.ViewAdded, value: result, context: context as any })
    } catch(err) {
      this.nodeAction.emit({ action: NodeAction.AddViewError, value: err, context: context as any })
    }
  }

  //** On view added */
  async onViewAdded(node: INodeResponse, context: Node) {
    const mapped = Node.fromApiNode(node, NodeProjection.Minified) as Node;

    if(this.activeNode == context) {
      this.activeNode.hasView = true;
    }

    if(this.currentNode == context) {
      this.onNewChildAdded(context, mapped)
    }
  }


  //** Edit view */
  async editView(data: CreateNodeRequest, fileData: any, context: Node) {
    try {
      const result = await this.nodeService.replaceView(context.id, data, fileData);

      this.nodeAction.emit({ action: NodeAction.ViewEdited, value: result, context: context as any })
    } catch(err) {
      this.nodeAction.emit({ action: NodeAction.ReplaceViewError, value: err, context: context as any })
    }
  }

  //** On view edited */
  async onViewEdited(node: INodeResponse, context: Node) {
    const mapped = Node.fromApiNode(node, NodeProjection.Minified) as Node;

    if(this.activeNode == context) {
      this.activeNode.hasView = true;
    }

    if(this.currentNode == context) {
      this.onNewChildAdded(context, mapped)
    }
  }

  async deleteView(id: string, context: Node) {
    try {
      const result = await this.nodeService.deleteView(id);

      this.nodeAction.emit({ action: NodeAction.ViewRemoved, value: result, context: context as any });
    } catch(err) {
      this.nodeAction.emit({ action: NodeAction.RemoveViewError, value: err, context: context as any });
    }
  }

  async onViewDeleted(node: INodeResponse, context: Node) {
    const mapped = Node.fromApiNode(node, NodeProjection.Minified) as Node;

    if(this.activeNode == context) {
      this.activeNode.hasView = false;
    }

    if(this.currentNode == context) {
      this.currentNode.hasView = false;
      this.currentNode.children = this.currentNode.children.filter(x => x.id != mapped.id);
      this.currentNode.childrenIds = this.currentNode.childrenIds.filter(x => x != mapped.id);
    }
  }

  async uploadContent(value: any, context: Node, file?: File) {
    try {
      const result = await this.nodeService.uploadContent(context.id, value, file);

      this.nodeAction.emit({ action: NodeAction.ContentUploaded, value: result, context: context as any });
    } catch(err) {
      this.nodeAction.emit({ action: NodeAction.UploadContentError, value: err, context: context as any });
    }
  }

  async onContentUploaded(value: any, context: Node) {
    if(this.activeNode == context) {

    }
    if(this.currentNode == context) {

    }

    this.snackService.openSuccess('Content uploaded successfully');
  }

  async deleteContent(value: any, context: Node) {
    try {
      const result = await this.nodeService.deleteContent(context.id);

      this.nodeAction.emit({ action: NodeAction.ContentDeleted, value: result, context: context as any });
    } catch(err) {
      this.nodeAction.emit({ action: NodeAction.DeleteContentError, value: err, context: context as any });
    }
  }

  async onContentDeleted(value: any, context: Node) {
    if(value) {
      context.content = null;

      this.snackService.openSuccess('Node content deleted successfully');
    }
  }

  emitError(error: NodeAction, value: any, context: Node) {
    this.nodeAction.emit({ action: error, value, context })
  }
}

export interface NodeEvent {
  action: NodeAction,
  value: any,
  context: Node
}

export interface DeleteNodeRequest { //TODO Move to common
  id: string,
  ids?: string[],
  cascade: boolean,
  orphaned: boolean,
  reattach: boolean
}

