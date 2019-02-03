import { Repository } from "./repository.model";
import { Contributor } from '../contributor/contributor.model';

describe('Repository', () => {
    it('should create simple repository', () => {
        const repository = new Repository('org/repo');

        expect(repository.organization).toEqual('org');
        expect(repository.name).toEqual('repo');
    });

    it('should add contributors', () => {
        const repository = new Repository('org/repo');

        repository.addContributors([new Contributor(1, 'username1', 0)]);
        repository.addContributors([new Contributor(2, 'username2', 0)]);

        expect(repository.contributors.length).toEqual(2);
    });
});
