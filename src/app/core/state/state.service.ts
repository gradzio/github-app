import { Contributor } from '../domain/contributor/contributor.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { SortableCollection } from '../sortable.collection';
import { Repository } from '../domain/repository/repository.model';

@Injectable({
    providedIn: 'root'
})
export class StateService {
    private contributorSubject = new BehaviorSubject(null);
    contributor$ = this.contributorSubject.asObservable();

    private repoSubject = new BehaviorSubject(null);
    repo$ = this.repoSubject.asObservable();

    // private contributorReposSubject = new BehaviorSubject([]);
    // contributorRepos$: Observable<SortableCollection> = this.contributorReposSubject.asObservable();
    selectContributor(contributor: Contributor) {
        this.contributorSubject.next(contributor);
        // this.contributorReposSubject.next(new SortableCollection(contributor.repositories));
    }

    selectRepo(repo: Repository) {
        this.repoSubject.next(repo);
    }
}