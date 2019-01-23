import { MemoryStorage } from "./memory.store";

describe('MemoryCache', () => {
    let cache;
    beforeEach(() => {
        cache = new MemoryStorage();
        cache.setItem('foo', 'bar');
    });
    it('should create', () => {
        expect(cache).toBeTruthy();
    });

    it('should contain pre-entered key', () => {
        expect(cache.length).toBe(1);
    });

    it('should give null on non-existing item', () => {
        expect(cache.getItem('nonexistingkey')).toBeNull();
    });

    it('should get item by key', () => {
        const actual = cache.getItem('foo');

        expect(actual).toEqual('bar');
    });

    it('should clear cache', () => {
        cache.clear();

        expect(cache.length).toBe(0);
    });

    it('should remove item by key', () => {
        cache.removeItem('foo');

        expect(cache.length).toBe(0);
    });

    it('should get null on index out of bound', () => {
        expect(cache.key(-1)).toBeNull();
        expect(cache.key(1)).toBeNull();
        expect(cache.key(2)).toBeNull();
    });

    it('should get item by index', () => {
        expect(cache.key(0)).toBe('bar');
    });
});