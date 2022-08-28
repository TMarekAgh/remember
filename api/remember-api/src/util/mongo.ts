import { Types } from 'mongoose';

export const asObjectId = (id: string) => new Types.ObjectId(id);

export const objectIdsEqual = (id1: Types.ObjectId, id2: Types.ObjectId) => {
    const equal = id1.toString() == id2.toString();
    return equal;
} 
    