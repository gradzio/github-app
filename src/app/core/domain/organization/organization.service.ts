import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, BehaviorSubject, of, from } from 'rxjs';
import { Contributor } from '../contributor/contributor.model';
import { Organization } from './organization.model';
import { switchMap, map, tap, filter } from 'rxjs/operators';
import { PaginatedService } from '../../pagination/paginated.service';
import { LinkHeaderParser } from '../../pagination/link-header.parser';
import { RepositoryService } from '../repository/repository.service';
import { Repository } from '../repository/repository.model';
import { ContributorService } from '../contributor/contributor.service';
import { github } from 'src/config/github';

@Injectable({
    providedIn: 'root'
})
export class OrganizationService extends PaginatedService{
    organizationSubject = new BehaviorSubject(new Organization('angular'));
    organization$ = this.organizationSubject.asObservable();

    protected perPage;
    protected page;
    constructor(protected client: HttpClient, protected parser: LinkHeaderParser, private repoService: RepositoryService, private contributorService: ContributorService) {
        super(client, parser);
        // this.getOrganizationContributors(this.organizationSubject.getValue()).subscribe();
        // const organization = new Organization('angular');
        // for(let i = 0; i < 10000; i++) {
        //     const contributor = new Contributor(i, 'username' + i, 0);
        //     contributor.followers = Math.ceil(Math.random() * 100);
        //     contributor.gists = Math.ceil(Math.random() * 20);
        //     contributor.contributions = Math.ceil(Math.random() * 1000);
        //     contributor.repoCount = Math.ceil(Math.random() * 50);
        //     organization.addContributor(contributor);
        // }
        // this.organizationSubject.next(organization);
    }

    getOrganizationContributors(organization: Organization) {
        const baseUri = `${github.baseUrl}/orgs/${organization.name}/repos`;
        return this.client.get<any>(`${baseUri}?per_page=${this.perPage}&page=${this.page}`, {headers: github.headers, observe: 'response'})
        .pipe(
            switchMap(response => {
                return response.body;
            }),
            // map(console.log)
            // forkJoin(response => {
            //     console.log(response);
            // //     return of('a');
            // })
            // switchMap(response => this.getRemainingPages(response, baseUri)),
            // switchMap((allResponses: any) => {
            //     const allCalls = [];
            //     allResponses.forEach(response => {
            //         response.body.forEach(repository => {
            //             organization.addRepository(new Repository(repository.full_name));
            //             allCalls.push(
            //                 this.client.get(`${github.baseUrl}/repos/${repository.full_name}/contributors?page=1&per_page=100`, {headers: github.headers, observe: 'response'})
            //                 .pipe(
            //                     switchMap(resp => this.getRemainingPages(resp, `${github.baseUrl}repos/${repository.full_name}/contributors`))
            //                 )
            //             );
            //         })
            //     });
            //     this.organizationSubject.next(organization);
            //     return forkJoin(allCalls);
            // }),
            // map(allGroupedResponses => {
            //     const flattenResponses = [];
            //     allGroupedResponses.forEach(group => {
            //         group.forEach(response => flattenResponses.push(response))
            //     });
            //     return flattenResponses;
            // }),
            // map(allResponses => {
            //     const newOrganization = this.organizationSubject.getValue();
            //     allResponses
            //     .filter(resp => resp.body)
            //     .forEach((response: any) => 
            //         response.body.forEach(contributor => {
            //             const contributorObject = new Contributor(contributor.id, contributor.login, 1);
            //             contributorObject.contributions = contributor.contributions;
            //             newOrganization.addContributor(contributorObject);
            //         })
            //     );
            //     this.organizationSubject.next(newOrganization);
            //     return newOrganization;
            // }),
            // switchMap((newOrganization: any) => {
            //     const allCalls = newOrganization.contributors.map(contributor => 
            //         this.client.get<any>(`${github.baseUrl}/users/${contributor.username}`, {headers: github.headers, observe: 'response'})
            //             .pipe(
            //                 map(response => {
            //                     const contributorObject = response.body;

            //                     contributor.followers = contributorObject.followers;
            //                     contributor.gists = contributorObject.public_gists;
            //                     contributor.repoCount = contributorObject.public_repos;
            //                     newOrganization.addContributor(contributorObject);
            //                     this.organizationSubject.next(newOrganization);
            //                 })
            //             )
            //     );
            //     return forkJoin(allCalls);
            // })
        );
    }

    getRemainingPages(resp, baseUri) {
        return super.getRemainingPages(resp, baseUri);
    }
}