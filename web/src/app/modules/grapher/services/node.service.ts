import { EventEmitter, Injectable } from '@angular/core';
import { HttpService } from '../../shared/services/http.service';
import { GetNodeRequest, CreateNodeRequest, GetNodeResponse, INodeResponse, FilterNodesRequest } from '@nihil/remember-common';
import { INode as IApiNode } from '@nihil/remember-common';
import { Cacher } from '../classes/cacher';
import { NodeEvent, ViewerState } from '../classes/viewer-state';
import { AuthService } from '../../auth/services/auth.service';
import { UserDataService } from './user-data.service';
import { MatDialog } from '@angular/material/dialog';
import { SnackBarService } from '../../shared/services/snack-bar.service';
import { filter, firstValueFrom } from 'rxjs';
import { errorMap, successMap } from '../enums/node-action.enum';
import { Tag, TagService } from './tag.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { UserService } from '../../user/services/user.service';

@Injectable({
  providedIn: 'root'
})
export class NodeService {

  private baseApiPath = "/node";

  cacher = new Cacher<INodeResponse, string>((node: INodeResponse) => node.id);

  state = new ViewerState(
    this,
    this.userService,
    this.authService,
    this.userDataService,
    this.tagService,
    this.dialog,
    this.snackService,
    this.router,
    this.location
  );

  nodeChanged = new EventEmitter<string>();

  action(ev: NodeEvent) {
    this.state.nodeAction.emit(ev);

    const success = successMap[ev.action];
    const error = errorMap[ev.action];

    if(!success && !error) return Promise.resolve(null);

    return firstValueFrom(
      this.state.nodeAction.pipe(
        filter(x => x.action == success || x.action == error)
      )
    )
  }

  onAction = this.state.nodeAction.asObservable();

  constructor(
    private readonly http: HttpService,
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly userDataService: UserDataService,
    private readonly tagService: TagService,
    private readonly dialog: MatDialog,
    private readonly snackService: SnackBarService,
    private readonly router: Router,
    private readonly location: Location
  ) {}

  public async create(data: CreateNodeRequest, file?: File) {
    const multipart = new FormData();

    multipart.append('name', data.name);
    multipart.append('description', data.description);
    multipart.append('parents', JSON.stringify(data.parents));
    multipart.append('existingChildren', JSON.stringify(data.existingChildren));
    multipart.append('newChildren', JSON.stringify(data.newChildren));
    multipart.append('links', JSON.stringify(data.links));
    multipart.append('type', JSON.stringify(data.type));
    multipart.append('tags', JSON.stringify(data.tags))
    multipart.append('contentType', JSON.stringify(data.contentType));
    multipart.append('contentData', JSON.stringify(data.contentData));
    multipart.append('permissions', JSON.stringify(data.permissions ?? []));

    if(file)
      multipart.append('file', file)

    const response = await this.http.post<any>(`${this.baseApiPath}`, multipart);

    // this.cacher.add(response.node);

    return response;
  }

  public async update(data: any) {
    const response = await this.http.patch<any>(`${this.baseApiPath}`, data);

    // this.cacher.add(response.node);

    return response;
  }

  public async delete(id: string) {
    const response = await this.http.delete<IApiNode>(`${this.baseApiPath}/${id}`, {
      id
    });

    // this.cacher.remove(id);

    return response;
  }

  public async get(id: string, data: GetNodeRequest): Promise<GetNodeResponse> {

    try {
      const response = await this.http.post<GetNodeResponse>(`${this.baseApiPath}/${id}`, data);

      if(!response) return null as any; //Notification

      // this.cacher.add(response.node);

      return response;
    } catch(ex: any) {
      if(ex.status == 403) {
        this.snackService.openError('You have no access to this object');
      }

      throw ex;
    }

  }

  public async getMany(ids: string[]): Promise<any> {

    let cachedIds = ids.filter(x => this.cacher.cached(x));

    let newIds = ids.filter(x => !this.cacher.cached(x));

    let cached = cachedIds.map(x => this.cacher.get(x));

    if(newIds.length == 0) return cached;

    const response = await this.http.post<INodeResponse[]>(`${this.baseApiPath}/nodes`, { ids: newIds });

    if(!response) return null as any;

    for(let node of response) {
      this.cacher.add(node);
    }

    return [...cached, ...response];
  }

  public async filter(data: FilterNodesRequest & GetNodeRequest) {
    const response = await this.http.post<INodeResponse[]>(`${this.baseApiPath}/filter`, data); //TODO change to FilterNodesResponse

    // response.map(item => this.cacher.add(item));

    return response;
  }

  public async getContent(id: string) {
    const response = await this.http.get<any>(`${this.baseApiPath}/${id}/content`, { responseType: 'blob' });

    return response;
  }

  public onNodeModified(id: string) {
    this.cacher.remove(id); //TODO Remove for now, later change to action based on update type(remove, update, add, content change etc).
    this.nodeChanged.emit(id);
  }

  public async addLinks(id: string, links: string[]) {
    if(!links || links.length < 1) throw new Error('Links to add cannot be null or empty');

    const data = {
      links
    }

    const result = await this.http.post(`${this.baseApiPath}/${id}/links`, data);

    return result;
  }

  public async removeLinks(id: string, links: string[]) {
    if(!links || links.length < 1) throw new Error('Links to remove cannot be null or empty');

    const data = {
      links
    }

    const result = await this.http.delete(`${this.baseApiPath}/${id}/links`, data);

    return result;
  }

  public async addParents(id: string, parents: string[]) {
    if(!parents || parents.length < 1) throw new Error('Parents to add cannot be null or empty');

    const data = {
      parents
    }

    const result = await this.http.post(`${this.baseApiPath}/${id}/parents`, data);

    return result;
  }

  public async removeParents(id: string, parents: string[]) {
    if(!parents || parents.length < 1) throw new Error('Parents to remove cannot be null or empty');

    const data = {
      parents
    }

    const result = await this.http.delete(`${this.baseApiPath}/${id}/parents`, data);

    return result;
  }

  public async addChildren(id: string, children: string[]) {
    if(!children || children.length < 1) throw new Error('Children to add cannot be null or empty');

    const data = {
      children: children
    }

    const result = await this.http.post(`${this.baseApiPath}/${id}/children`, data);

    return result;
  }

  public async removeChildren(id: string, children: string[]) {
    if(!children || children.length < 1) throw new Error('Children to remove cannot be null or empty');

    const data = {
      children
    }

    const result = await this.http.delete(`${this.baseApiPath}/${id}/children`, data);

    return result;
  }

  /**
   * Used to return view file for node (file attached to the view child)
   * @param id Id of the node for which to return view
   * @returns File representing view
   */
  public async getView(id: string) {
    const response = await this.http.get<any>(`${this.baseApiPath}/${id}/view`, { responseType: 'blob' });

    return response;
  }

  /**
   * Used to delete view child for node
   * @param id Id of the node for which to delete view child
   * @returns Whether the deletion was successful
   */
  public async deleteView(id: string) {
    const response = await this.http.delete<any>(`${this.baseApiPath}/${id}/view`, { id });

    return response;
  }

  /**
   * Used to replace view file for node (file attached to the view child)
   * @param id Id of the node for which to delete view child
   * @returns Whether the replacement was successful
   */
  public async replaceView(id: string, data: any, file?: File) {
    const multipart = new FormData();

    multipart.append('contentType', JSON.stringify(data.contentType));
    multipart.append('contentData', JSON.stringify(data.contentData));

    if(file)
      multipart.append('file', file)

    const response = await this.http.put<any>(`${this.baseApiPath}/${id}/view`, multipart);

    return response;
  }

  public async addTags(id: string, tags: string[]) {
    const response = await this.http.post<any>(`${this.baseApiPath}/${id}/tags`, { id, tags });

    return response;
  }

  public async removeTags(id: string, tags: string[]) {
    const response = await this.http.delete<any>(`${this.baseApiPath}/${id}/tags`, { id, tags });

    return response;  }

  public async editTags(id: string, tags: string[]) {
    const response = await this.http.put<any>(`${this.baseApiPath}/${id}/tags`, { id, tags });

    return response;
  }

  public async uploadContent(id: string, data: any, file?: File) {
    const multipart = new FormData();

    multipart.append('contentType', JSON.stringify(data.contentType));
    multipart.append('contentData', JSON.stringify(data.contentData));

    if(file)
      multipart.append('file', file)

    const response = await this.http.put(`${this.baseApiPath}/${id}/content`, multipart);

    return response;
  }

  public async deleteContent(id: string) {
    const response = await this.http.delete(`${this.baseApiPath}/${id}/content`);

    return response;
  }
}
