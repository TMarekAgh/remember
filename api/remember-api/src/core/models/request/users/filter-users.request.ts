import { ApiProperty } from "@nestjs/swagger";
import { Filter } from "src/core/classes/filter";
import { FilterUsersProps } from "src/user-auth/services/auth.service";
import { GetOptions } from "../../get-options.model";

export class FilterUsersRequest {

    @ApiProperty()
    displayName?: Filter<string>;

    @ApiProperty()
    options?: GetOptions;

    static getProps(request: FilterUsersRequest): FilterUsersProps {
        const props: { [key: string]: any } = {}

        if(request.displayName) props.displayName = Filter.getFilterObject(request.displayName);

        const limit = request.options?.limit;
        const page = request.options?.page;

        if(limit) props.limit = limit; 
        if(page) props.skip = page - 1 * limit;

        return props;
    }
}