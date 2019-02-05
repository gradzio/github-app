import { Contributor } from '../domain/contributor/contributor.model';
import { BehaviorSubject, Observable, forkJoin, of, zip, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Repository } from '../domain/repository/repository.model';
import { map, switchMap, filter } from 'rxjs/operators';
import { StoreService } from './store.service';
import { Organization } from '../domain/organization/organization.model';
import { ContributorDetail } from '../domain/contributor-details/contributor-detail.model';

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
                    if (org.isLoaded) {
                        org.repositories.forEach(repo => {
                            this.store.fetchRepositoryContributors(repo.fullName);
                        });
                    }
                    this.selectedOrganizationSubject.next(org);
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
                    
                    const organization: Organization = this.selectedOrganizationSubject.getValue();
                    if (repository.isPartOfOrganization(organization)) {
                        organization.mergeRepository(repository);
                        if (organization.hasLoadedAllRepos) {
                            this.store.fetchContributorDetails(organization.contributorsWithoutDetailNames);
                        }
                        this.selectedOrganizationSubject.next(organization);
                    }
                })
            ).subscribe();
    }

    selectContributor(contributor: Contributor) {
        this.selectedContributorSubject.next(contributor);
        this.store.fetchContributorRepos(contributor.username);
        this.store.fetchContributorDetails([]);
    }

    selectOrganization(organizationName: string) {
        this.selectedOrganizationSubject.next(new Organization(0, organizationName));
        this.store.fetchOrganization(organizationName);
    }

    selectRepo(repo: Repository) {
        this.selectedRepoSubject.next(repo);
        this.store.fetchRepositoryContributors(repo.fullName);
        this.store.fetchContributorDetails([]);
    }

    private mergeRepoContributorDetails(contributorDetails) {
        const repo: Repository = this.selectedRepoSubject.getValue();
        if (repo) {
            repo.mergeContributorDetails(contributorDetails);
            this.selectedRepoSubject.next(repo);
        }
    }

    private mergeOrgContributorDetails(contributorDetails) {
        const org: Organization = this.selectedOrganizationSubject.getValue();
        if (org) {
            org.mergeContributorDetails(contributorDetails);
            this.selectedOrganizationSubject.next(org);
        }
    }

    private mergeContributorContributorDetails(contributorDetails) {
        const contributor: Contributor = this.selectedContributorSubject.getValue();
        if (contributor) {
            const contributorDetail = contributorDetails[contributor.username];
            if (contributorDetail) {
                contributor.merge(contributorDetail);
                this.selectedContributorSubject.next(contributor);
            }
        }
    }
}