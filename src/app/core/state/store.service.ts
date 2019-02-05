import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { Organization } from '../domain/organization/organization.model';
import { switchMap, map, retry } from 'rxjs/operators';
import { Repository } from '../domain/repository/repository.model';
import { Injectable } from '@angular/core';
import { Contributor } from '../domain/contributor/contributor.model';
import { RepositoryService } from '../domain/repository/repository.service';
import { OrganizationService } from '../domain/organization/organization.service';
import { ContributorService } from '../domain/contributor/contributor.service';

interface LoadDetails {
    contributorNames: string[]
}

@Injectable({
    providedIn: 'root'
})
export class StoreService {
    private detailEventsSubject = new Subject<LoadDetails>();
    detailEvents$ = this.detailEventsSubject.asObservable();
    
    private isDetailProcessingEnabledSubject = new BehaviorSubject<boolean>(false);
    isDetailProcessingEnabled$ = this.isDetailProcessingEnabledSubject.asObservable();

    private organizationSubject = new Subject<Organization>();
    organization$ = this.organizationSubject.asObservable();
    private contributorSubject = new Subject<Contributor>();
    contributor$ = this.contributorSubject.asObservable();
    private repositorySubject = new Subject<Repository>();
    repository$: Observable<Repository> = this.repositorySubject.asObservable();
    private contributorDetailsSubject = new BehaviorSubject({});
    contributorDetails$ = this.contributorDetailsSubject.asObservable();
    
    contributorDetailsToBeFetched = [];

    contributorPageSize = 50;
    
    constructor(private orgService: OrganizationService, private repoService: RepositoryService, private contributorService: ContributorService) {
        this.detailEvents$.subscribe(detailsEvent => {
            this.processContributorsChunk(detailsEvent.contributorNames);
        });

        this.contributorDetails$.subscribe(details => {
            if (this.contributorDetailsToBeFetched.length > 0 && this.isDetailProcessingEnabledSubject.getValue() === true) {
                this.contributorDetailsToBeFetched = this.contributorDetailsToBeFetched.filter(contributorName => Object.keys(details).indexOf(contributorName) == -1);
                this.detailEventsSubject.next({
                    contributorNames: this.contributorDetailsToBeFetched.slice(0, this.contributorPageSize)
                });
            }
        });
     }

     processContributorsChunk(contributorsChunk: string[]) {
        const details = this.contributorDetailsSubject.getValue();
        this.contributorService.getContributorsDetails(contributorsChunk)
            .pipe(
                retry(5),
                map((contributorDetails) => {
                    contributorDetails.forEach(contributorDetail => {
                        details[contributorDetail.login] = contributorDetail;
                    });
                    this.contributorDetailsSubject.next(details);
                    return details;
                })
            ).subscribe();
     }

     fetchRepositoryContributors(repoName: string) {
         const repository = new Repository(repoName);
        this.contributorService.getAllByRepoFullName(repository.fullName)
            .pipe(
                map((contributors: Contributor[]) => {
                    repository.addContributors(contributors);
                    repository.mergeContributorDetails(this.contributorDetailsSubject.getValue());
                    this.repositorySubject.next(repository);
                })
            ).subscribe();
     }

     fetchContributorRepos(contributorName: string) {
        this.contributorService.getOne(contributorName)
            .pipe(
                map((contributor: Contributor) => {
                    const contributorDetails = this.contributorDetailsSubject.getValue();
                    if (!contributorDetails[contributor.username]) {
                        contributorDetails[contributor.username] = contributor;
                        this.contributorDetailsSubject.next(contributorDetails);
                    }
                    return contributor;
                }),
                switchMap((contributor: Contributor) => {
                    return this.repoService.getAllByContributorName(contributor.username)
                        .pipe(
                            map((repositories: Repository[]) => {
                                contributor.addRepositories(repositories);
                                this.contributorSubject.next(contributor);
                            })
                        )
                })
            )
            .subscribe();
     }

     fetchOrganization(organizationName: string) {
        this.orgService.getOne(organizationName)
            .pipe(
                switchMap((organization: Organization) => {
                    return this.repoService.getAllByOrganizationName(organization.name)
                    .pipe(
                        map((repositories: Repository[]) => {
                            organization.addRepositories(repositories);
                            this.organizationSubject.next(organization);
                        })
                    )
                })
            ).subscribe();
     }

     fetchContributorDetails(contributorNames: string[]) {
        const fetchedContributorNames = Object.keys(this.contributorDetailsSubject.getValue());
        this.contributorDetailsToBeFetched = contributorNames.filter(contributorName => fetchedContributorNames.indexOf(contributorName) == -1);
        if (this.contributorDetailsToBeFetched.length > 0) {
            this.isDetailProcessingEnabledSubject.next(true);
            const contributorsChunk = this.contributorDetailsToBeFetched.slice(0, this.contributorPageSize);
            this.detailEventsSubject.next({contributorNames: contributorsChunk});
        }
     }

     disableDetailProcessing() {
         this.isDetailProcessingEnabledSubject.next(false);
     }
}
