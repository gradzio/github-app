import { SortDirection, Sort } from '@angular/material';
import { Injectable } from '@angular/core';

export class SortableCollection {
    private _sort: Sort;
    private _items = [];
    constructor(sort: Sort) {
        this._sort = sort;
    }

    paginate(pageSize: number) {
        const start = 0;
        const pages = [];
        while(start + pageSize <= this.items.length) {

        }
    }

    set items(items) {
        this._items = items;
    }

    set sort(sort: Sort) {
        this._sort = sort;
    }

    private doSort() {
        this._items.sort((a, b) => this._compare(a[this._sort.active] || -1, b[this._sort.active] || -1, this._sort.direction === 'asc'));
        return this._items;
    }

    private _compare(a: number | string, b: number | string, isAsc: boolean) {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }

    get items() {
        return this.doSort();
    }
}
