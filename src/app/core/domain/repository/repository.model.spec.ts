import { Repository } from "./repository.model";
import { Contributor } from '../contributor/contributor.model';

describe('Repository', () => {
    it('should create simple repository', () => {
        const repository = new Repository('org/repo');

        expect(repository.organization).toEqual('org');
        expect(repository.name).toEqual('repo');
        expect(repository.contributorsUrl).toEqual('https://api.github.com/repos/org/repo/stats/contributors');
    });

    it('should add contributors', () => {
        const repository = new Repository('org/repo');

        repository.addContributors([new Contributor(1, 'username1')]);
        repository.addContributors([new Contributor(2, 'username2')]);

        expect(repository.contributors.length).toEqual(2);
    });
});