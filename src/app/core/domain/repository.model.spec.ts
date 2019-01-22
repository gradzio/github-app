import { Repository } from "./repository.model";

describe('Repository', () => {
    it('should create simple repository', () => {
        const repository = new Repository('org/repo');

        expect(repository.organization).toEqual('org');
        expect(repository.name).toEqual('repo');
        expect(repository.contributorsUrl).toEqual('https://api.github.com/repos/org/repo/stats/contributors');
    });
});
