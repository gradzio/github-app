import { github } from 'src/config/github';
import { BehaviorSubject, Subject, Observable, forkJoin, of, from } from 'rxjs';
import { Organization } from '../domain/organization/organization.model';
import { HttpClient } from '@angular/common/http';
import { switchMap, map, flatMap, filter, mergeMap, retry } from 'rxjs/operators';
import { Repository } from '../domain/repository/repository.model';
import { Injectable } from '@angular/core';
import { Contributor } from '../domain/contributor/contributor.model';
import { SortableCollection } from '../sortable.collection';
import { LinkHeaderParser } from '../pagination/link-header.parser';
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
            this.orgService.getOrganizationRepos(orgEvent.data)
            .pipe(
                map((organization: Organization) => {
                    this.organizationSubject.next(organization);
                    organization.repositories.forEach(repo => {
                        this.repoEventsSubject.next({type: EventType.NEW, name: repo.fullName, data: repo});
                    });
                })
            ).subscribe();
        });

        this.contributorEvents$.subscribe(contributorEvent => {
            this.contributorService.getContributorRepos(contributorEvent.data)
                .pipe(
                    map(contributor => {
                        const contributorDetail = this.contributorDetailsSubject.getValue()[contributor.username];
                        if (contributorDetail) {
                            contributor.merge(contributorDetail);
                        }
                        this.contributorSubject.next(contributor);
                    })
                ).subscribe();
        });

        this.repoEvents$.subscribe(repoEvent => {
            this.repoService.getRepoContributors(repoEvent.data)
                .pipe(
                    map(repository => {
                        repository.mergeContributorDetails(this.contributorDetailsSubject.getValue());
                        this.repositorySubject.next(repository);
                    })
                ).subscribe();
        });

        this.detailEvents$.subscribe(needsNewPage => {
            if (needsNewPage && this.contributorDetailsToBeFetched.length > 0) {
                const contributorsChunk = this.contributorDetailsToBeFetched.slice(0, this.contributorPageSize);
                this.contributorService.getContributorsDetails(contributorsChunk)
                    .pipe(
                        map((contributorDetails) => {
                            const details = this.contributorDetailsSubject.getValue();
                            contributorDetails.forEach(contributorDetail => {
                                details[contributorDetail.login] = contributorDetail;
                            });
                            this.contributorDetailsSubject.next(details);
                            return details;
                        })
                    ).subscribe(details => {
                            this.contributorDetailsToBeFetched = this.contributorDetailsToBeFetched.filter(contributorName => Object.keys(details).indexOf(contributorName) == -1);
                            if (this.contributorDetailsToBeFetched.length > 0 && this.onPage === 0) {
                                this.detailEventsSubject.next({type: EventType.NEW, name: 'details'});
                                this.onPage++;
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

     fetchContributorRepos(contributor: Contributor) {
        this.contributorEventsSubject.next({
            type: EventType.NEW,
            name: contributor.username,
            data: contributor
        });
     }

     fetchOrganization(organization: Organization) {
         this.orgEventsSubject.next({
            type: EventType.NEW,
            name: organization.name,
            data: organization
        });
     }

     fetchContributorDetails(contributorNames: string[]) {
        const fetchedContributorNames = Object.keys(this.contributorDetailsSubject.getValue());
        contributorNames = contributorNames.filter(contributorName => fetchedContributorNames.indexOf(contributorName) == -1);
        if (contributorNames.length > 0) {
            this.contributorDetailsToBeFetched = [...contributorNames, ...this.contributorDetailsToBeFetched.filter(contributorName => contributorNames.indexOf(contributorName) == -1 )];
            this.detailEventsSubject.next({type: EventType.NEW, name: 'details'});
        }
     }
}
