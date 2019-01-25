import { SortDirection } from '@angular/material';

export class SortableCollection {
    private _items;
    constructor(items) {
        this._items = items;
    }

    sort(property: string, direction: SortDirection) {
        this._items.sort((a, b) => this._compare(a[property], b[property], direction === 'asc'));
        return this._items;
    }

    private _compare(a: number | string, b: number | string, isAsc: boolean) {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }

    get items() {
        return this._items;
    }
}
