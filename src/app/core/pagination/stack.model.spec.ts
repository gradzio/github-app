import { PagedStack } from "./stack.model";

fdescribe('PagedStack', () => {
    let stack: PagedStack<string>;
    beforeEach(() => {
        stack = new PagedStack(2);
    });
    it('should create empty stack', () => {
        expect(stack.length).toEqual(0);
    });

    it('should push single item page to stack', () => {
        const names = ['name1'];

        stack.push(names);

        expect(stack.length).toEqual(1);
    });
});