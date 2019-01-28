import { SortDirection, Sort } from '@angular/material';
import { Injectable } from '@angular/core';

@Injectable()
export class SortableCollection {
    private _sort: Sort;
    private _items = [];
    constructor(sort: Sort) {
        this._sort = sort;
    }

    set items(items) {
        this._items = items;
    }

    set sort(sort: Sort) {
        this._sort = sort;
    }

    private doSort() {
        this._items.sort((a, b) => this._compare(a[this._sort.active], b[this._sort.active], this._sort.direction === 'asc'));
        return this._items;
    }

    private _compare(a: number | string, b: number | string, isAsc: boolean) {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }

    get items() {
        return this.doSort();
    }
}
