import { NodeSubType } from "../../../../enums/core/node-subtype.enum";
import { NodeType } from "../../../../enums/core/node-type.enum";
import { Filter } from "../../filter";

export class FilterNodesRequest {

    id?: Filter<string>;
    
    name?: Filter<string>;

    type?: Filter<NodeType>;

    subtype?: NodeSubType;
}