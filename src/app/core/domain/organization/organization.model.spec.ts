import { Organization } from "./organization.model";
import { Contributor } from '../contributor/contributor.model';
import { Repository } from '../repository/repository.model';

describe('Organization', () => {
    let organization: Organization;

    beforeEach(() => {
        organization = new Organization(1, 'org');
    });

    it('should make simple organization', () => {
        expect(organization.name).toEqual('org');
    });

    
    it('should merge new repository', () => {
        const repo = new Repository('org/repo');

        organization.mergeRepository(repo);

        expect(organization.repositories.length).toEqual(1);
        expect(organization.repositories[0].fullName).toEqual(repo.fullName);
    });

    it('should merge two same repositories', () => {
        const repo = new Repository('org/repo');

        organization.mergeRepository(repo);
        organization.mergeRepository(repo);

        expect(organization.repositories.length).toEqual(1);
        expect(organization.repositories[0].fullName).toEqual(repo.fullName);
    });

    it('should get single repo contributor', () => {
        const repo = new Repository('org/repo');
        const contributor = new Contributor(1, 'username', 5);
        repo.addContributor(contributor);

        organization.addRepository(repo);

        const actual = organization.repoContributors;

        expect(actual.length).toEqual(1);
        expect(actual[0].contributions).toEqual(5);
        expect(actual[0].username).toEqual('username');
    });

    it('should get multiple repo contributor', () => {
        const repo = new Repository('org/repo');
        const contributorSize = Math.ceil(Math.random() * 10);
        for(let index=0;index<contributorSize;index++) {
            const contributor = new Contributor(index, 'username' + index, index);
            repo.addContributor(contributor);
        }

        organization.addRepository(repo);

        const actual = organization.repoContributors;

        expect(actual.length).toEqual(contributorSize);
        expect(actual[contributorSize-1].contributions).toEqual(contributorSize-1);
        expect(actual[contributorSize-1].username).toEqual('username'+(contributorSize-1));
    });

    it('should return single contributor which is duplicated in repos', () => {
        const repo1 = new Repository('org/repo1');
        const repo2 = new Repository('org/repo2');
        const contributor = new Contributor(1, 'username', 1);
        repo1.addContributor(contributor);
        repo2.addContributor(contributor);
        organization.addRepositories([repo1, repo2]);

        const actual = organization.repoContributors;

        expect(actual.length).toEqual(1);
        expect(actual[0].username).toEqual('username');
        expect(actual[0].contributions).toEqual(2);
    });
});