import { Contributor } from '../domain/contributor/contributor.model';
import { BehaviorSubject, Observable, forkJoin, of, zip } from 'rxjs';
import { Injectable } from '@angular/core';
import { SortableCollection } from '../sortable.collection';
import { Repository } from '../domain/repository/repository.model';
import { RepositoryService } from '../domain/repository/repository.service';
import { map, switchMap } from 'rxjs/operators';
import { StoreService } from './store.service';

@Injectable({
    providedIn: 'root'
})
export class StateService {
    private contributorSubject = new BehaviorSubject(null);
    contributor$ = this.contributorSubject.asObservable();

    private repoSubject = new BehaviorSubject(null);
    repo$ = this.repoSubject.asObservable();

    private repoContributorsSubject = new BehaviorSubject(new SortableCollection({active: 'contributions', direction: 'desc'}));
    repoContributors$ = this.repoContributorsSubject.asObservable();

    constructor(private store: StoreService, private repoService: RepositoryService) {

    }
    // private contributorReposSubject = new BehaviorSubject([]);
    // contributorRepos$: Observable<SortableCollection> = this.contributorReposSubject.asObservable();
    selectContributor(contributor: Contributor) {
        this.contributorSubject.next(contributor);
        // this.contributorReposSubject.next(new SortableCollection(contributor.repositories));
    }

    selectRepo(repo: Repository) {
        this.repoSubject.next(repo);
        zip(
            this.repoService.getRepoContributors(repo),
            this.store.contributorDetails$
        ).pipe(
            map(contributorsZip => {
                const repo = contributorsZip[0];
                const contributorDetails = contributorsZip[1];
                const contribs = repo.contributors.map(contributor => {
                    const contributorDetail = contributorDetails[contributor.username];
                    if (contributorDetail) {
                        contributor.merge(contributorDetail);
                    }
                    return contributor;
                });
                const collection = this.repoContributorsSubject.getValue();
                collection.items = contribs;
                this.repoContributorsSubject.next(collection);
                const missingContributors = repo.contributors.filter(contributor => contributorDetails[contributor.username] == null);
                // console.log('missingContributors', missingContributors);
                this.store.fetchContributorDetails(missingContributors.map(contrib => contrib.username));
            })
        ).subscribe();

        this.store.contributorDetails$
            .subscribe(contributorDetails => {
                const repo = this.repoSubject.getValue();
                if (repo) {
                    const contribs = repo.contributors.map(contributor => {
                        const contributorDetail = contributorDetails[contributor.username];
                        if (contributorDetail) {
                            contributor.merge(contributorDetail);
                        }
                        return contributor;
                    });
                    const collection = this.repoContributorsSubject.getValue();
                    collection.items = contribs;
                    this.repoContributorsSubject.next(collection);
                }
            });
    }
}