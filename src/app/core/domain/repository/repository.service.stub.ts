import { Repository } from './repository.model';
import { Contributor } from '../contributor/contributor.model';
import { of } from 'rxjs';

export class RepositoryServiceStub {
    getRepoContributors(repository: Repository) {
        repository.addContributors(new Contributor(1, 'username1'));
        repository.addContributors(new Contributor(2, 'username2'));

        return of(repository);
    }
}