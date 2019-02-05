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
        expect(repository.contributors.size).toEqual(0);
    });

    it('should have single contributor', () => {
        repository.addContributor(new Contributor(1, 'username', 0));
        expect(repository.contributors.size).toEqual(1);
    });

    // it('should get contributor', () => {
    //     repository.addContributor(new Contributor(1, 'username', 0));
    //     const contributor = repository.getContributor('username');
    //     expect(contributor.id).toEqual(1);
    //     expect(contributor.username).toEqual('username');
    // });

    // it('should not duplicate same contributors', () => {
    //     organization.addContributor(new Contributor(1, 'username1', 0));
    //     organization.addContributor(new Contributor(2, 'username2', 0));
    //     organization.addContributor(new Contributor(1, 'username1', 0));
    //     expect(organization.contributors.size).toEqual(2);
    // });

});
