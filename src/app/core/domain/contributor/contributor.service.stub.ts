import { Contributor } from './contributor.model';
import { Repository } from '../repository/repository.model';
import { of } from 'rxjs';

export class ContributorServiceStub {
    getContributorRepos(contributor: Contributor) {
        contributor.addRepository(new Repository(contributor.username + '/repo1'));
        contributor.addRepository(new Repository(contributor.username + '/repo2'));
        contributor.addRepository(new Repository(contributor.username + '/repo3'));
        return of(contributor);
    }
}