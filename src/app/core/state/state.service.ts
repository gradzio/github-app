import { Contributor } from '../domain/contributor/contributor.model';
import { BehaviorSubject, Observable, forkJoin, of, zip } from 'rxjs';
import { Injectable } from '@angular/core';
import { SortableCollection } from '../sortable.collection';
import { Repository } from '../domain/repository/repository.model';
import { RepositoryService } from '../domain/repository/repository.service';
import { map, switchMap, filter } from 'rxjs/operators';
import { StoreService } from './store.service';
import { Organization } from '../domain/organization/organization.model';

@Injectable({
    providedIn: 'root'
})
export class StateService {
    private selectedOrganizationSubject = new BehaviorSubject(null);
    selectedOrganization$ = this.selectedOrganizationSubject.asObservable();

    private selectedContributorSubject = new BehaviorSubject(null);
    selectedContributor$ = this.selectedContributorSubject.asObservable();

    private selectedRepoSubject = new BehaviorSubject(null);
    selectedRepo$ = this.selectedRepoSubject.asObservable();

    constructor(private store: StoreService) {
        this.store.organization$
            .pipe(
                map(org => this.selectedOrganizationSubject.next(org))
            )
            .subscribe();

        this.store.contributorDetails$
            .pipe(
                map(contributorDetails => {
                    this.mergeRepoContributorDetails(contributorDetails);
                    this.mergeOrgContributorDetails(contributorDetails);
                    this.mergeContributorContributorDetails(contributorDetails);
                })
            ).subscribe();

        this.store.contributor$
            .pipe(
                filter(contributor => contributor.isEqual(this.selectedContributorSubject.getValue())),
                map(contributor => this.selectedContributorSubject.next(contributor))
            ).subscribe();

        this.store.repository$
            .pipe(
                // filter(repository => repository.isEqual(this.selectedRepoSubject.getValue())),
                map(repository => this.selectedRepoSubject.next(repository))
            ).subscribe();
        
            // zip(
            //     this.store.repository$,
            //     this.store.contributorDetails$
            // ).pipe(
            //     // filter(contributorsZip => contributorsZip[0].isEqual(this.selectedRepoSubject.getValue())),
            //     map(contributorsZip => {
            //         const repo = contributorsZip[0];
            //         const contributorDetails = contributorsZip[1];
            //         this.selectedRepoSubject.next(repo);
                    
            //         this.mergeRepoContributorDetails(contributorDetails);

            //         // const missingContributors = repo.contributors.filter(contributor => contributorDetails[contributor.username] == null);
            //         // this.store.fetchContributorDetails(missingContributors.map(contrib => contrib.username));
            //     })
            // ).subscribe();
    }

    selectContributor(contributor: Contributor) {
        this.selectedContributorSubject.next(contributor);
        this.store.fetchContributorRepos(contributor);
    }

    selectOrganization(organization: Organization) {
        this.selectedOrganizationSubject.next(organization);
        this.store.fetchOrganization(organization);
    }

    selectRepo(repo: Repository) {
        this.selectedRepoSubject.next(repo);
        this.store.fetchRepositoryContributors(repo);
    }

    private mergeRepoContributorDetails(contributorDetails) {
        const repo = this.selectedRepoSubject.getValue();
        if (repo) {
            const contribs = repo.contributors.map(contributor => {
                const contributorDetail = contributorDetails[contributor.username];
                if (contributorDetail) {
                    contributor.merge(contributorDetail);
                }
                return contributor;
            });
            repo.addContributors(contribs);
            this.selectedRepoSubject.next(repo);
        }
    }

    private mergeOrgContributorDetails(contributorDetails) {
        const org = this.selectedOrganizationSubject.getValue();
        if (org) {
            org.contributors.forEach(contributor => {
                const contributorDetail = contributorDetails[contributor.username];
                if (contributorDetail) {
                    org.updateContributor(contributor.username, contributorDetail);
                    this.selectedOrganizationSubject.next(org);
                }
            });
        }
    }

    private mergeContributorContributorDetails(contributorDetails) {
        const contributor = this.selectedContributorSubject.getValue();
        if (contributor) {
            const contributorDetail = contributorDetails[contributor.username];
            if (contributorDetail) {
                contributor.merge(contributorDetail);
                this.selectedContributorSubject.next(contributor);
            }
        }
    }
}