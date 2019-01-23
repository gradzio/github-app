import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class MemoryStorage implements Storage {
    private storage: Map<string, any>;
    constructor() {
        if (!this.storage) {
            this.storage = new Map();
        }
        console.log(this.storage);
    }

    clear(): void {
        this.storage.clear();
    }

    getItem(key: string) {
        return this.storage.get(key) || null;
    }
    key(index: number) {
        if (index < 0 || index >= this.storage.size) {
            return null;
        }
        return this.storage.get([ ...Array.from( this.storage.keys() ) ][index]);
    }
    removeItem(key: string): void {
        this.storage.delete(key);
    }

    setItem(key: string, value: any): void {
        this.storage.set(key, value);
    }
    [name: string]: any;

    get length(): number {
        return this.storage.size;
    }
}