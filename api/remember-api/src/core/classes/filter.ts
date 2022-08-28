import { FilterOperation } from "../enums/filter-operation.enum";

export class Filter<T> {
    property: string;
    operation: FilterOperation;
    value: T;

    static getFilterObject(filter: Filter<any>) {
        switch(filter.operation) {
            case FilterOperation.Contains:
                return { $regex: filter.value, $options: 'i' }
            case FilterOperation.Equals:
                return { $eq: filter.value }
            case FilterOperation.GreaterThan:
                return { $gt: filter.value }
            case FilterOperation.LesserThan:
                return { $lt: filter.value }
            case FilterOperation.Includes:
                return { $in: filter.value }
            default:
                return {}
        }
    }
}