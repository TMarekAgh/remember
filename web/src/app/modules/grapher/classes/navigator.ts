import { NodeContentType, NodeType } from "@nihil/remember-common";

export class Navigator {
  history: string[] = [];

  private _current: number = 0;

  get hasNext() {
    return this._current < this.history.length;
  }

  get hasPrevious() {
    return this._current > 1;
  }

  next() {
    if(!this.hasNext) return;

    this._current += 1;

    return this.get(this._current);
  }

  previous() {
    if(!this.hasPrevious) return;

    this._current -= 1;

    return this.get(this._current);
  }

  get(num: number) {
    return this.history[num - 1];
  }

  current() {
    return this.history[this._current];
  }

  last() {
    return this.history[this.history.length - 1];
  }

  first() {
    return this.history[0];
  }

  add(item: string) {
    this._current += 1;

    if(this.history.length < this._current)
      this.history.push(item);
    else
      this.history[this._current - 1] = item;

    this.history = this.history.splice(0, this._current);
  }

  remove(item: string) {
    const initialLength = this.history.length;
    this.history = this.history.filter(x => x != item);
    const deletedCount = initialLength - this.history.length;
    this._current -= deletedCount;
  }
}

export const nodeTypeMap = {
  [NodeType.Root]: 'Root',
  [NodeType.Container]: 'Container',
  [NodeType.File]: 'File',
  [NodeType.Media]: 'Media',
  [NodeType.View]: 'View'
}

export const nodeContentTypeMap = {
  [NodeContentType.Direct]: 'Direct',
  [NodeContentType.File]: 'File'
}
