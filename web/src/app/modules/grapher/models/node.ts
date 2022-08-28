import { AdjacentResponse, DictionaryNodeResponse, GetNodeResponse, INodeResponse, MinifiedNodeResponse, NodeContentType, NodeProjection, NodeResponse, NodeSubType, NodeType } from "@nihil/remember-common";
import { Tag } from "../services/tag.service";

//TODO make type magic for strong typing on returned node (based on projection)

export class Node {
  public id: string = '';
  public name: string = '';
  public description: string = '';
  public children: Node[] = [];
  public childrenIds: string[] = [];
  public parents: Node[] = [];
  public parentIds: string[] = []
  public links: Node[] = [];
  public linkIds: string[] = [];
  public tagIds: string[] = []
  public tags: Tag[] = [];
  public permissions: string[] = [];
  public type: NodeType = NodeType.Container;
  public subtype: NodeSubType = NodeSubType.Undefined;
  public contentType: NodeContentType = NodeContentType.Direct;
  public contentData?: any;
  public file?: any;
  public creatorId?: string;

  public hasContent: boolean = false;
  public hasView: boolean = false;
  public viewNode?: Node;
  public content?: any;

  public static fromApiNode(
    node: INodeResponse,
    project: NodeProjection
  ) {
    switch(project) {
      case NodeProjection.Dictionary:
        return DictionaryNode.fromApiNode(node);
      case NodeProjection.Minified:
        return MinifiedNode.fromApiNode(node);
    }

    throw('No corresponding api node projection')
  }

  public static fromAdjacent(adjacent: AdjacentResponse, project: string): AdjacentNodes {
    let map!: (node: any) => any;

    switch(project) {
      case NodeProjection.Dictionary:
        map = DictionaryNode.fromApiNode
        break;
      case NodeProjection.Minified:
        map = MinifiedNode.fromApiNode
        break;
    }

    if(!map) throw('No corresponding api node projection')

    return {
      children: adjacent.children.map((x: any) => map(x)),
      parents: adjacent.parents.map((x: any) => map(x)),
      links: adjacent.links.map((x: any) => map(x)),
    }
  }

  public static fromGetNodeResponse(
    request: GetNodeResponse,
    project: NodeProjection,
    projectAdjacent: NodeProjection
  ) {
    const res: Node = Node.fromApiNode(request.node, project) as any as Node;

    if(!!request.adjacent) {
      const adj = Node.fromAdjacent(request.adjacent, projectAdjacent)
      const parents = adj.parents;
      const children = adj.children;
      const links = adj.links;

      res.hasView = !!children.find(x => x.type == NodeType.View);
      res.hasContent = request.node.type == NodeType.File || request.node.type == NodeType.View;

      res.parents = parents;
      res.parentIds = parents.map(x => x.id);

      res.children = children;
      res.childrenIds = children.map(x => x.id);

      res.links = links;
      res.linkIds = children.map(x => x.id);
    }

    return res;
  }

  public static equal(n1: Node, n2: Node) {
    return n1.id == n2.id;
  }

  public static clone(node: Node) {
    const result = new MinifiedNode();

    result.id = node.id;
    result.name = node.name;
    result.description = node.description;
    result.childrenIds = node.childrenIds;
    result.linkIds = node.linkIds;
    result.type = node.type;
    result.subtype = node.subtype;

    return result;
  }

  public static isChild(child: Node, parent: Node) {
    return child.parentIds.includes(parent.id) || parent.childrenIds.includes(child.id);
  }

  public static isParent(parent: Node, child: Node) {
    return parent.childrenIds.includes(child.id);
  }

  public static isLink(link: Node, related: Node) {
    return related.linkIds.includes(link.id);
  }

}

export class DictionaryNode {
  public id: string = '';
  public name: string = '';

  public static fromApiNode(node: DictionaryNodeResponse) {
    const res = new DictionaryNode();

    res.id = node.id;
    res.name = node.name;

    return res;
  }
}

export class MinifiedNode {
  public id: string = '';
  public name: string = '';
  public description: string = '';
  public childrenIds: string[] = [];
  public linkIds: string[] = [];
  public parentIds: string[] = [];
  public tagIds: string[] = [];
  public permissions: string[] = [];
  public type: NodeType = NodeType.Container;
  public subtype: NodeSubType = NodeSubType.Undefined;
  public creatorId: string = '';

  public hasContent: boolean = false;

  public static fromApiNode(node: MinifiedNodeResponse) {
    const res = new MinifiedNode();

    res.id = node.id;
    res.name = node.name;
    res.description = node.description;
    res.childrenIds = node.nodeChildren;
    res.linkIds = node.nodeLinks;
    res.creatorId = node.creatorId;
    res.type = node.type;
    res.subtype = node.subtype;
    res.tagIds = node.tags;
    res.permissions = node.permissions;
    if(node.nodeParents) res.parentIds = node.nodeParents;

    res.hasContent = node.type == NodeType.File || node.type == NodeType.View;

    return res;
  }
}

export interface AdjacentNodes {
  parents: Node[],
  children: Node[],
  links: Node[]
}
