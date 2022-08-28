import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FilterOperation } from '@nihil/remember-common';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { Tag, TagService } from 'src/app/modules/grapher/services/tag.service';
import { SnackBarService } from 'src/app/modules/shared/services/snack-bar.service';
import { UserService } from 'src/app/modules/user/services/user.service';

@Component({
  selector: 'app-graph-menu-tags',
  templateUrl: './graph-menu-tags.component.html',
  styleUrls: ['./graph-menu-tags.component.sass']
})
export class GraphMenuTagsComponent implements OnInit {

  tags!: Tag[];
  canCreate: boolean = false;

  constructor(
    public tagService: TagService,
    public dialog: MatDialog,
    public changeDetectorRef: ChangeDetectorRef,
    private snackService: SnackBarService,
    private authService: AuthService,
    private userService: UserService
  ) { }

  filters: {
    name: string
  } = {
    name: ''
  }

  editing: any = {};

  ngOnInit(): void {
    this.getAllTags()
  }

  async getAllTags() {
    const currentUser = await this.userService.getCurrentUser();
    const result = await this.tagService.filterTags({
      name: {
        property: 'name',
        value: '',
        operation: FilterOperation.Contains
      },
      creator: {
        property: 'creator',
        value: currentUser.id ?? '',
        operation: FilterOperation.Equals
      }
    });

    if(!result) this.snackService.openError('There was an error while retrieving tags');

    this.tags = result as Tag[];
  }

  async addTag() {
    const name = this.filters.name;

    if(this.tags.find(x => x.name == name)) return;

    const result = await this.tagService.addTag(name);

    if(!result) {
      this.snackService.openError('There was an error while adding tag')
      return;
    } else {
      this.snackService.openSuccess('Tag added succesfully')
    }

    this.tags.push(result);

    this.filters.name = '';

    return result;
  }

  async removeTag(id: string) {

    if(!id) return;

    const result: any = await this.tagService.deleteTag(id);

    if(!result) return;

    if(!result) {
      this.snackService.openError('There was an error while removing tag')
      return;
    } else {
      this.snackService.openSuccess('Tag removed succesfully')
    }

    this.tags = this.tags.filter(x => x._id != result._id)

    return result;
  }

  startEditing(tag: any) {
    tag.editing = true;
    this.editing[tag._id] = tag.name;
  }

  stopEditing(tag: any) {
    tag.editing = false;
    delete this.editing[tag._id];
  }

  async editTag(tag: any) {
    const newName = this.editing[tag._id];
    const result = await this.tagService.updateTag({
      ...tag,
      name: newName
    });

    if(!result) {
      this.snackService.openError('There was an error while trying to update tag');
    }

    this.snackService.openSuccess('Tag succesfully updated');

    const index = this.tags.findIndex(x => x._id == result?._id);

    if(index < 0) return;

    let updatedTag = {
      ...this.tags[index],
      name: (result as any)?.name
    };

    this.tags[index] = updatedTag;

    this.tags = [...this.tags];

    this.stopEditing(this.tags[index]);

    this.changeDetectorRef.detectChanges();
  }

  filterSearched = (tag: Tag) => {
    return tag.name.toLowerCase().includes(this.filters.name.toLowerCase());
  }

  searchChanged(value: any) {
    this.canCreate = this.tags.filter(this.filterSearched).length == 0;
  }
}
