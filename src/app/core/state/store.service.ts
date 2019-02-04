import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { Organization } from '../domain/organization/organization.model';
import { switchMap, map, flatMap, filter, mergeMap, retry } from 'rxjs/operators';
import { Repository } from '../domain/repository/repository.model';
import { Injectable } from '@angular/core';
import { Contributor } from '../domain/contributor/contributor.model';
import { RepositoryService } from '../domain/repository/repository.service';
import { OrganizationService } from '../domain/organization/organization.service';
import { ContributorService } from '../domain/contributor/contributor.service';

interface Event {
    type: EventType;
    name: string;
    data?: any;
}

enum EventType {
    NEW,
    UPDATE
}

@Injectable({
    providedIn: 'root'
})
export class StoreService {
    private orgEventsSubject = new Subject<Event>();
    orgEvents$: Observable<Event> = this.orgEventsSubject.asObservable();
    private repoEventsSubject = new Subject<Event>();
    repoEvents$: Observable<Event> = this.repoEventsSubject.asObservable();
    private contributorEventsSubject = new Subject<Event>();
    contributorEvents$: Observable<Event> = this.contributorEventsSubject.asObservable();
    private detailEventsSubject = new Subject<Event>();
    detailEvents$ = this.detailEventsSubject.asObservable();

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
    onPage = 0;
    perPage = 100;
    page = 1;
    constructor(private orgService: OrganizationService, private repoService: RepositoryService, private contributorService: ContributorService) {
        this.orgEvents$.subscribe((orgEvent: Event) => {
            this.orgService.getOne(orgEvent.name)
            .pipe(
                switchMap((organization: Organization) => {
                    return this.repoService.getAllByOrganizationName(organization.name)
                    .pipe(
                        map((repositories: Repository[]) => {
                            organization.addRepositories(repositories);
                            organization.markLoaded();
                            this.organizationSubject.next(organization);
                        })
                    )
                })
            ).subscribe();
        });

        this.contributorEvents$.subscribe((contributorEvent: Event) => {
            this.contributorService.getOne(contributorEvent.name)
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
                                contributor.markLoaded();
                                this.contributorSubject.next(contributor);
                            })
                        )
                })
            )
            .subscribe();
        });

        this.repoEvents$.subscribe(repoEvent => {
            this.contributorService.getAllByRepoFullName(repoEvent.name)
                .pipe(
                    map((contributors: Contributor[]) => {
                        const repository = repoEvent.data;
                        repository.addContributors(contributors);
                        repository.mergeContributorDetails(this.contributorDetailsSubject.getValue());
                        repository.markLoaded();
                        this.repositorySubject.next(repository);
                    })
                ).subscribe();
        });

        this.detailEvents$.subscribe(detailsEvent => {
            if (this.contributorDetailsToBeFetched.length > 0) {
                // this.contributorDetailsToBeFetched = detailsEvent.data;
                const contributorsChunk = this.contributorDetailsToBeFetched.slice(0, this.contributorPageSize);
                const details = this.contributorDetailsSubject.getValue();
                this.contributorService.getContributorsDetails(contributorsChunk)
                    .pipe(
                        map((contributorDetails) => {
                            contributorDetails.forEach(contributorDetail => {
                                details[contributorDetail.login] = contributorDetail;
                            });
                            return details;
                        })
                    ).subscribe(details => {
                        this.contributorDetailsSubject.next(details);
                        if (this.contributorDetailsToBeFetched.length > 0) {
                            this.contributorDetailsToBeFetched = this.contributorDetailsToBeFetched.filter(contributorName => Object.keys(details).indexOf(contributorName) == -1);
                            this.detailEventsSubject.next({type: EventType.NEW, name: 'details'});
                        }
                        }, error => console.log('oops', error)
                    );
            }
        });
     }

     fetchRepositoryContributors(repo: Repository) {
         this.repoEventsSubject.next({
             type: EventType.NEW,
             name: repo.fullName,
             data: repo
         });
     }

     fetchContributorRepos(contributorName: string) {
        this.contributorEventsSubject.next({
            type: EventType.NEW,
            name: contributorName,
        });
     }

     fetchOrganization(organizationName: string) {
         this.orgEventsSubject.next({
            type: EventType.NEW,
            name: organizationName
        });
     }

     fetchContributorDetails(contributorNames: string[]) {
        const fetchedContributorNames = Object.keys(this.contributorDetailsSubject.getValue());
        this.contributorDetailsToBeFetched = contributorNames.filter(contributorName => fetchedContributorNames.indexOf(contributorName) == -1);
        if (this.contributorDetailsToBeFetched.length > 0) {
            // this.contributorDetailsToBeFetched = [...contributorNames, ...this.contributorDetailsToBeFetched.filter(contributorName => contributorNames.indexOf(contributorName) == -1 )];
            this.detailEventsSubject.next({type: EventType.NEW, name: 'details'});
        }
     }
}
