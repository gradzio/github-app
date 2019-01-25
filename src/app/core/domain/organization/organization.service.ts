import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, BehaviorSubject, of } from 'rxjs';
import { Contributor } from '../contributor/contributor.model';
import { Organization } from './organization.model';
import { switchMap, map, tap, filter } from 'rxjs/operators';
import { PaginatedService } from '../../pagination/paginated.service';
import { LinkHeaderParser } from '../../pagination/link-header.parser';
import { RepositoryService } from '../repository/repository.service';
import { Repository } from '../repository/repository.model';

@Injectable({
    providedIn: 'root'
})
export class OrganizationService extends PaginatedService{
    organizationSubject = new BehaviorSubject(new Organization('angular'));
    organization$ = this.organizationSubject.asObservable();

    protected perPage;
    protected page;
    constructor(protected client: HttpClient, protected parser: LinkHeaderParser, private repoService: RepositoryService) {
        super(client, parser);
        this.getOrganizationContributors(this.organizationSubject.getValue()).subscribe();
    }

    getOrganizationContributors(organization: Organization) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer 6ba278712f38dc6b05d8ac4c2203b4f4b107e48e'
          })
        const baseUri = `https://api.github.com/orgs/${organization.name}/repos`;
        return this.client.get<any>(`${baseUri}?per_page=${this.perPage}&page=${this.page}`, {headers, observe: 'response'})
        .pipe(
            switchMap(response => this.getRemainingPages(response, baseUri)),
            switchMap((allResponses: any) => {
                const allCalls = [];
                allResponses.forEach(response => {
                    response.body.forEach(repository => {
                        organization.addRepository(new Repository(repository.full_name));
                        this.organizationSubject.next(organization);
                        allCalls.push(
                            this.client.get(`https://api.github.com/repos/${repository.full_name}/contributors?page=1&per_page=100`, {headers, observe: 'response'})
                            .pipe(
                                switchMap(resp => this.getRemainingPages(resp, `https://api.github.com/repos/${repository.full_name}/contributors`))
                            )
                        );
                    })
                });
                return forkJoin(allCalls);
            }),
            map(allGroupedResponses => {
                const flattenResponses = [];
                allGroupedResponses.forEach(group => {
                    group.forEach(response => flattenResponses.push(response))
                });
                return flattenResponses;
            }),
            map(allResponses => {
                const newOrganization = this.organizationSubject.getValue();
                allResponses
                .filter(resp => resp.body)
                .forEach((response: any) => 
                    response.body.forEach(contributor => {
                        const contributorObject = new Contributor(contributor.id, contributor.login);
                        contributorObject.contributions = contributor.contributions;
                        newOrganization.addContributor(contributorObject);
                    })
                );
                this.organizationSubject.next(newOrganization);
            })
        );
    }

    getRemainingPages(resp, baseUri) {
        return super.getRemainingPages(resp, baseUri);
    }
}