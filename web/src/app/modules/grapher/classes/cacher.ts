type KT = string | number | symbol;
type Internal<T> = {
  value: T,
  data: any
}

export class Cacher<T, KeyType extends String | number> {

  constructor(
    private getKeyFromObject: (item: T) => KeyType,
    private options: CacherOptions = new CacherOptions({})
  ) {}

  cache: { [key: KT]: Internal<T> } = {};
  additionHistory: KT[] = [];

  add(item: T, data = {}) {
    const key = <KT> this.getKeyFromObject(item);

    if(!key) return null;

    this.cache[key] = {
      value: item,
      data
    }

    this.onItemAdded(key);

    return true;
  }

  get(key: KeyType) {
    const k = <KT> key;
    return this.cache[k].value;
  }

  remove(key: KeyType) {
    const k = <KT> key;
    const item = this.cache[k];
    delete this.cache[k];
    const itemIndex = this.additionHistory.findIndex(x => x == key);
    this.additionHistory = this.additionHistory.splice(itemIndex, 1);
    return item;
  }

  clear() {
    this.cache = {};
  }

  cached(key: KT) {
    return !!this.cache[key];
  }

  private onItemAdded(key: KT) {
    this.additionHistory.push(key);

    if(this.options.cacheSize == 0) return;
    if(this.additionHistory.length > this.options.cacheSize)
      this.additionHistory = this.additionHistory.splice(1, this.additionHistory.length - 1);
  }
}

export class CacherOptions {

  constructor(options: ICacherOptions) {
    if(!!options.cacheSize) this.cacheSize = options.cacheSize;
  }

  cacheSize: number = 0;
}

export interface ICacherOptions {
  cacheSize?: number;
}
