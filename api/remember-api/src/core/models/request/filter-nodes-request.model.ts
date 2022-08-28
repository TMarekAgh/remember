import { Filter } from "../../classes/filter";
import { NodeSubType } from "../../enums/node-subtype.enum";
import { NodeType } from "../../enums/node-type.enum";
import { FilterNodesProps } from "../filter-nodes.model";
import { execForEachProp } from "../../../util/object";
import { ApiProperty } from "@nestjs/swagger";
import { GetOptions } from "../get-options.model";

const filterFields = ['id', 'name', 'type', 'subtype', 'creator', 'tags'];

export class FilterNodesRequest {

    @ApiProperty()
    id?: Filter<string>;
    
    @ApiProperty()
    name?: Filter<string>;

    @ApiProperty()
    type?: Filter<NodeType>;

    @ApiProperty()
    user?: Filter<string>;

    @ApiProperty()
    subtype?: NodeSubType;

    @ApiProperty()
    options?: GetOptions;

    static getProps(request: FilterNodesRequest): FilterNodesProps {
        const props: { [key: string]: any } = {};

        execForEachProp(request, (obj, key, filter) => 
            { 
                if(filter && filterFields.includes(key)) 
                    props[key] = Filter.getFilterObject(filter)
            })            

        const limit = request.options?.limit;
        const page = request.options?.page;

        if(limit) props.$limit = limit; 
        if(page) props.$skip = page - 1 * limit;

        return props;
    }
}