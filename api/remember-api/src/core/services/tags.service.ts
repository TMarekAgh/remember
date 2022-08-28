import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Tag, TagDocument } from "../schemas/tag.schema";
import { UpdateTagProps } from "../models/props/tags/update-tag.props";
import { DeleteTagProps } from "../models/props/tags/delete-tag.props";
import { CreateTagProps } from "../models/props/tags/create-tag.props";
import { FilterTagsProps } from "../models/props/tags/filter-tags.props";
import { EventEmitter2 } from "@nestjs/event-emitter";

@Injectable()
export class TagsService {

    constructor(
        @InjectModel(Tag.name) private tagModel: Model<TagDocument>,
        private eventEmitter: EventEmitter2    
    ) {}

    async getTags(ids: string[]) {
        const tags = await this.tagModel.find({ _id: { $in: ids }});

        return tags;
    }

    async getTag(id: string) {
        const tag = await this.tagModel.findById(id);

        return tag;
    }

    async addTag(props: CreateTagProps, creatorId: string) {
        const tag = new Tag(props.name, creatorId);

        const added = await this.tagModel.create(tag);

        return added;
    }

    async addTags(props: CreateTagProps[], creatorId: string) {
        const tags = props.map(prop => new Tag(prop.name, creatorId));

        const added = await this.tagModel.create(tags);
    
        return added;
    }

    async deleteTag(props: DeleteTagProps) {
        const deleted = await this.tagModel.findByIdAndRemove(props.id);

        if(deleted) {
            this.eventEmitter.emit('tag.deleted', { id: props.id });
        }

        return deleted;
    }

    async updateTag(props: UpdateTagProps) {
        const updated = await this.tagModel.findById(props.id);

        updated.name = props.name;
        
        await updated.save()

        return updated;
    }

    async filterTags(props: FilterTagsProps) {
        const query: { [key: string]: any } = {};
        
        const options: { [key: string]: any } = {};

        if (props.name) query.name = props.name;
        if (props.creator) query.creator = props.creator;
        if (props.limit) options.limit = props.limit;
        
        const tags = await this.tagModel.find(query, null, options);

        return tags;
    }
}