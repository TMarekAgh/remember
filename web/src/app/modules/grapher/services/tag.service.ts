import { Injectable } from '@angular/core';
import { FilterOperation, FilterTagsRequest } from '@nihil/remember-common';
import { HttpService } from '../../shared/services/http.service';
import { UserService } from '../../user/services/user.service';

@Injectable({
  providedIn: 'root'
})
export class TagService {

  private baseApiPath = '/tags'

  constructor(
    private userService: UserService,
    private readonly http: HttpService
  ) {}

  async getTag(id: string) {
    if(!id) return;
    const result = await this.http.get<any>(`${this.baseApiPath}/${id}`);

    return result;
  }

  async getTags(ids: string[]) {
    const result = await this.http.post<any>(`${this.baseApiPath}/many`, {
      ids
    })

    return result;
  }

  async addTag(tag: string) {
    if(!tag) return;

    const result = await this.addTags([tag]);

    if(!result) return;

    return result;
  }

  async addTags(tags: string[]) {

    if(!tags || tags.length < 1) return;

    const payload = tags.map(x => ({ name: x }));

    const result = await this.http.post<Tag>(this.baseApiPath, payload);

    if(!result) return;

    return result;
  }

  async deleteTag(id: string) {
    if(!id) return;

    const result = await this.http.delete<Tag>(`${this.baseApiPath}/${id}`);

    if(!result) return;

    return result;
  }

  async updateTag(tag: Tag) {
    if(!tag._id) return

    const result = await this.http.patch<Tag>(`${this.baseApiPath}/${tag._id}`, { name: tag.name });

    if(!result) return;

    return result;
  }

  async filterTags(filter: FilterTagsRequest) {
    const result = await this.http.post<Tag[]>(`${this.baseApiPath}/filter`, filter);

    if(!result) return []; //TODO handle

    return result;
  }

  async getCurrentUserTags() {
    const currentUser = await this.userService.getCurrentUser();

    return await this.filterTags({
      name: {
        property: 'name',
        operation: FilterOperation.Contains,
        value: ''
      },
      creator: {
        property: 'creator',
        operation: FilterOperation.Equals,
        value: currentUser.id
      }
    })
  }

}

export type Tag = {
  _id: string,
  name: string
}

//TODO Move tag filtering logic from view here
