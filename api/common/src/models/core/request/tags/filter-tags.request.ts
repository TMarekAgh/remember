import { Filter } from "../../filter";

export interface FilterTagsRequest {

    name: Filter<string>;

    creator: Filter<string>;

    limit?: number;

    skip?: number;
}