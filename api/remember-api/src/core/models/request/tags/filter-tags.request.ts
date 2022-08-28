import { ApiProperty } from "@nestjs/swagger";
import { Filter } from "src/core/classes/filter";
import { GetOptions } from "../../get-options.model";
import { FilterTagsProps } from "../../props/tags/filter-tags.props";

export class FilterTagsRequest {    
    
    @ApiProperty()
    name: Filter<string>;

    @ApiProperty()
    options?: GetOptions;

    @ApiProperty()
    creator?: Filter<string>;

    static getProps(request: FilterTagsRequest): FilterTagsProps {
        const props: { [key: string]: any } = {}

        if(request.name) props.name = Filter.getFilterObject(request.name);
        if(request.creator) props.creator = Filter.getFilterObject(request.creator);

        const limit = request.options?.limit;
        const page = request.options?.page;        

        if(limit) props.limit = limit; 
        if(page) props.skip = page - 1 * limit;

        return props;
    }
}