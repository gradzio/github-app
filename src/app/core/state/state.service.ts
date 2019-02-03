import { Contributor } from '../domain/contributor/contributor.model';
import { BehaviorSubject, Observable, forkJoin, of, zip } from 'rxjs';
import { Injectable } from '@angular/core';
import { Repository } from '../domain/repository/repository.model';
import { map, switchMap, filter } from 'rxjs/operators';
import { StoreService } from './store.service';
import { Organization } from '../domain/organization/organization.model';

@Injectable({
    providedIn: 'root'
})
export class StateService {
    private selectedOrganizationSubject = new BehaviorSubject<Organization>(null);
    selectedOrganization$ = this.selectedOrganizationSubject.asObservable();

    private selectedContributorSubject = new BehaviorSubject<Contributor>(null);
    selectedContributor$ = this.selectedContributorSubject.asObservable();

    private selectedRepoSubject = new BehaviorSubject(null);
    selectedRepo$ = this.selectedRepoSubject.asObservable();

    constructor(private store: StoreService) {
        this.store.organization$
            .pipe(
                map(org => {
                    this.selectedOrganizationSubject.next(org)
                })
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
                map(contributor => {
                    this.selectedContributorSubject.next(contributor);
                    if (contributor.isNotComplete()) {
                        this.store.fetchContributorDetails([contributor.username]);
                    }
                })
            ).subscribe();

        this.store.repository$
            .pipe(
                map(repository => {
                    if (repository.isEqual(this.selectedRepoSubject.getValue())) {
                        this.selectedRepoSubject.next(repository);
                        if (!repository.hasLoadedAllDetails) {
                            this.store.fetchContributorDetails(repository.contributorsWithoutDetailNames);
                        }
                    }
                    
                    const organization = this.selectedOrganizationSubject.getValue();
                    if (repository.isPartOfOrganization(organization)) {
                        organization.addRepoContributors(repository);
                        this.selectedOrganizationSubject.next(organization);
                        if (organization.hasLoadedAllRepos) {
                            // this.store.fetchContributorDetails(organization.contributorsWithoutDetailNames);
                        }
                    }
                })
            ).subscribe();
    }

    selectContributor(contributor: Contributor) {
        this.selectedContributorSubject.next(contributor);
        this.store.fetchContributorRepos(contributor);
        this.store.fetchContributorDetails([]);
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
            org.mergeContributorDetails(contributorDetails);
            this.selectedOrganizationSubject.next(org);
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