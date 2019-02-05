export class PagedStack<T> {
    private _items: T[] = [];
    private _count = 0;

    constructor(pageSize: number) {

    }
    
    get length(): number {
      return this._items.length;
    }
    
    push(items: T[]) {
      items.reverse().forEach(item => {
        this._items.push(item);  
      });
    }
  }