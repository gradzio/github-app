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
    private organizationSubject = new BehaviorSubject(new Organization('angular'));
    organization$ = this.organizationSubject.asObservable();
    repoEventsSubject = new Subject<Event>();
    repoEvents$: Observable<Event> = this.repoEventsSubject.asObservable();
    contributorEventsSubject = new Subject<Event>();
    contributorEvents$: Observable<Event> = this.contributorEventsSubject.asObservable();
    // contributorsSubject = new BehaviorSubject<SortableCollection>(new SortableCollection({active: 'contributions', direction: 'desc'}));
    // contributors$ = this.contributorsSubject.asObservable();
    contributorDetailsToBeFetched = [];
    contributorDetailsSubject = new BehaviorSubject({});
    contributorDetails$ = this.contributorDetailsSubject.asObservable();
    repoCounterSubject = new BehaviorSubject(0);
    repoCounter$ = this.repoCounterSubject.asObservable();
    contributorCounterSubject = new BehaviorSubject(0);
    contributorCounter$ = this.contributorCounterSubject.asObservable();
    loadContributorsPageSubject = new BehaviorSubject(false);
    loadContributorsPage$ = this.loadContributorsPageSubject.asObservable();
    contributorPageSize = 50;
    onPage = 0;
    perPage = 100;
    page = 1;
    constructor(private orgService: OrganizationService, private repoService: RepositoryService, private contributorService: ContributorService) {
        const organization = this.organizationSubject.getValue();
        this.orgService.getOrganizationRepos(organization)
        .pipe(
            map((organization: Organization) => {
                this.organizationSubject.next(organization);
                organization.repositories.forEach(repo => {
                    this.repoEventsSubject.next({type: EventType.NEW, name: repo.fullName, data: repo});
                });
            })
        ).subscribe();

        this.repoEvents$.subscribe(repoEvent => {
            this.repoService.getRepoContributors(repoEvent.data)
                .pipe(
                    map(repository => {
                        this.repoCounterSubject.next(this.repoCounterSubject.getValue() + 1);
                        const organization = this.organizationSubject.getValue();
                        organization.addRepoContributors(repository);
                        this.organizationSubject.next(organization);
                        if (organization.repositories.length - 1 === this.repoCounterSubject.getValue()) {
                            this.contributorDetailsToBeFetched = organization.contributorNames;
                            // this.contributorDetailsSubject.next(organization.contributors);
                            this.loadContributorsPageSubject.next(true);
                        }
                    })
                ).subscribe();
        });

        this.loadContributorsPage$.subscribe(needsNewPage => {
            if (needsNewPage && this.contributorDetailsToBeFetched.length > 0) {
                const contributorsChunk = this.contributorDetailsToBeFetched.slice(0, this.contributorPageSize);
                this.contributorService.getContributorsDetails(contributorsChunk)
                    .pipe(
                        map((contributorDetails) => {
                            const details = this.contributorDetailsSubject.getValue();
                            contributorDetails.forEach(contributorDetail => {
                                const organization = this.organizationSubject.getValue();
                                details[contributorDetail.login] = contributorDetail;
                                if (organization.hasContributor(contributorDetail.login)) {
                                    organization.updateContributor(contributorDetail.login, contributorDetail);
                                }
                            });
                            this.contributorDetailsSubject.next(details);
                            this.contributorCounterSubject.next(this.contributorCounterSubject.getValue() + contributorDetails.length);
                            return details;
                        })
                    ).subscribe(details => {
                            this.contributorDetailsToBeFetched = this.contributorDetailsToBeFetched.filter(contributorName => Object.keys(details).indexOf(contributorName) == -1);
                            if (this.contributorDetailsToBeFetched.length > 0) {
                                // console.log('left: ' + this.contributorDetailsToBeFetched.length);
                                this.loadContributorsPageSubject.next(true);
                            }
                        }, error => console.log('oops', error)
                    );
            }
        });
     }

     fetchContributorDetails(contributorNames: string[]) {
        const fetchedContributorNames = Object.keys(this.contributorDetailsSubject.getValue());
        contributorNames = contributorNames.filter(contributorName => fetchedContributorNames.indexOf(contributorName) == -1);
        if (contributorNames.length > 0) {
            this.contributorDetailsToBeFetched = [...contributorNames, ...this.contributorDetailsToBeFetched.filter(contributorName => contributorNames.indexOf(contributorName) == -1 )];
            this.loadContributorsPageSubject.next(true);
        }
     }
}
