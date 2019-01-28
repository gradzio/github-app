import { github } from 'src/config/github';
import { BehaviorSubject, Subject, Observable, forkJoin, of } from 'rxjs';
import { Organization } from '../domain/organization/organization.model';
import { HttpClient } from '@angular/common/http';
import { switchMap, map, flatMap, filter } from 'rxjs/operators';
import { Repository } from '../domain/repository/repository.model';
import { Injectable } from '@angular/core';
import { Contributor } from '../domain/contributor/contributor.model';
import { SortableCollection } from '../sortable.collection';
import { LinkHeaderParser } from '../pagination/link-header.parser';

interface Event {
    type: EventType;
    name: string;
    data: any
}

enum EventType {
    NEW,
    UPDATE
}

@Injectable()
export class StoreService {
    private organizationSubject = new BehaviorSubject(new Organization('angular'));
    organization$ = this.organizationSubject.asObservable();
    repoEventsSubject = new Subject<Event>();
    repoEvents$: Observable<Event> = this.repoEventsSubject.asObservable();
    contributorEventsSubject = new Subject<Event>();
    contributorEvents$: Observable<Event> = this.contributorEventsSubject.asObservable();
    contributorsSubject = new BehaviorSubject<SortableCollection>(new SortableCollection({active: 'contributions', direction: 'desc'}));
    contributors$ = this.contributorsSubject.asObservable();
    repoCounterSubject = new BehaviorSubject(0);
    repoCounter$ = this.repoCounterSubject.asObservable();
    perPage = 100;
    page = 1;
    constructor(private client: HttpClient, private parser: LinkHeaderParser) {
        const organization = this.organizationSubject.getValue();
        this.client.get<any>(`${github.baseUrl}/orgs/${organization.name}/repos?per_page=${this.perPage}&page=${this.page}`, {headers: github.headers, observe: 'response'})
        .pipe(
            switchMap(resp => {
                const pagination = this.parser.parse(resp.headers);
                const allCalls = [of(resp)];
                if (pagination && pagination.last) {
                    for(let i = 2; i <= <number><any>pagination.last.page; i++ ) {
                        allCalls.push(this.client.get(`${github.baseUrl}/orgs/${organization.name}/repos?per_page=${this.perPage}&page=${i}`, {
                            headers: github.headers,
                            observe: 'response'
                        }));
                    }
                }
                return forkJoin(allCalls);
            }),
            flatMap(resp => resp),
            filter(resp => resp.body),
            map(response => {
                response.body.map(repo => {
                    const repository = new Repository(repo.full_name);
                    organization.addRepository(repository);
                    this.repoEventsSubject.next({type: EventType.NEW, name: repo.full_name, data: repository});
                });
                this.organizationSubject.next(organization);
            })
        ).subscribe()

        this.repoEvents$.subscribe(repoEvent => {
            this.client.get<any>(`${github.baseUrl}/repos/${repoEvent.name}/contributors?per_page=${this.perPage}&page=${this.page}`, {headers: github.headers, observe: 'response'})
                .pipe(
                    filter(response => {
                        this.repoCounterSubject.next(this.repoCounterSubject.getValue() + 1);
                        return response.body;
                    }),
                    map(response => {
                        const organization = this.organizationSubject.getValue();
                        response.body.map(contributorData => {
                            // this.contributorEventsSubject.next({
                            //     type: organization.hasContributor(contributorObject.username) ? EventType.UPDATE : EventType.NEW,
                            //     name: contributorObject.username,
                            //     data: contributorObject
                            // });
                            organization.addContributor(contributorData);
                            const contributors = this.contributorsSubject.getValue();
                            contributors.items = organization.contributors;
                            this.contributorsSubject.next(contributors);
                        });
                        this.organizationSubject.next(organization);
                    })
                ).subscribe();
        });

        this.contributorEvents$.subscribe(contributorEvent => {
            if (contributorEvent.type === EventType.NEW) {
                // this.client.get<any>(`${github.baseUrl}/users/${contributorEvent.name}`, {headers: github.headers, observe: 'response'})
                // .pipe(
                //     map((response: any) => {
                //         const contributorDetail = response.body;
                //         const organization = this.organizationSubject.getValue();
                //         const contributor = new Contributor(contributorDetail.id, contributorDetail.loging, 0);
                //         contributor.followers = contributorDetail.followers;
                //         contributor.gists = contributorDetail.gists;
                //         contributor.repoCount = contributorDetail.public_repos;
                //         organization.addContributor(contributor)
                //         this.contributorsSubject.next(new SortableCollection(organization.contributors));
                //         this.organizationSubject.next(organization);
                //     })
                // ).subscribe();
            }
        });
     }

    
}