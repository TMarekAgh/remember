import { FilterOperation } from "../../enums/core/filter-operation.enum";

export interface Filter<T> {
    property: string;
    operation: FilterOperation;
    value: T;
}