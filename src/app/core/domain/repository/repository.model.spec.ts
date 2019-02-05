import { Repository } from "./repository.model";
import { Contributor } from '../contributor/contributor.model';

describe('Repository', () => {
    let repository;
    beforeEach(() => {
        repository = new Repository('org/repo');
    });
    it('should create simple repository', () => {
        expect(repository.organization).toEqual('org');
        expect(repository.name).toEqual('repo');
    });

    it('should add contributors', () => {
        repository.addContributors([new Contributor(1, 'username1', 0)]);
        repository.addContributors([new Contributor(2, 'username2', 0)]);

        expect(repository.contributors.length).toEqual(2);
    });

    it('should have no contributors', () => {
        expect(repository.contributors.length).toEqual(0);
    });

    it('should have single contributor', () => {
        repository.addContributor(new Contributor(1, 'username', 0));
        expect(repository.contributors.length).toEqual(1);
    });

    it('should not duplicate same contributors', () => {
        repository.addContributor(new Contributor(1, 'username1', 0));
        repository.addContributor(new Contributor(2, 'username2', 0));
        repository.addContributor(new Contributor(1, 'username1', 0));
        expect(repository.contributors.length).toEqual(2);
    });

    it('should add multiple contributors', () => {
        repository.addContributors([
            new Contributor(1, 'username1', 0),
            new Contributor(2, 'username2', 0),
            new Contributor(3, 'username3', 0)
        ]);
        expect(repository.contributors.length).toEqual(3);
    });

});
