import { Sort, MatPaginator } from '@angular/material'

export class SortableCollection<T> {
    private _sort: Sort;
    private _items: T[] = [];
    constructor(sort: Sort) {
        this._sort = sort;
    }

    set items(items: T[]) {
        this._items = items;
    }

    set sort(sort: Sort) {
        this._sort = sort;
    }

    private doSort(): T[] {
        this._items.sort((a, b) => this._compare(a[this._sort.active] || -1, b[this._sort.active] || -1, this._sort.direction === 'asc'));
        return this._items;
    }

    private _compare(a: number | string, b: number | string, isAsc: boolean) {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }

    get items(): T[] {
        return this.doSort();
    }
}
