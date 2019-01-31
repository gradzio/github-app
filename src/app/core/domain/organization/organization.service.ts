import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, BehaviorSubject, of, from } from 'rxjs';
import { Contributor } from '../contributor/contributor.model';
import { Organization } from './organization.model';
import { switchMap, map, tap, filter, flatMap } from 'rxjs/operators';
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
    constructor(protected client: HttpClient, protected parser: LinkHeaderParser) {
        super(client, parser);
    }

    getOrganizationRepos(organization: Organization) {
        const baseUri = `${github.baseUrl}/orgs/${organization.name}/repos`;
        return this.client.get<any>(`${baseUri}?per_page=${this.perPage}&page=${this.page}`, {headers: github.headers, observe: 'response'})
        .pipe(
            switchMap(resp => this.getRemainingPages(resp, `${github.baseUrl}/orgs/${organization.name}/repos`)),
            // flatMap(resp => resp),
            // filter(resp => resp.body),
            map(responses => {
                responses.forEach(response => {
                    response.body.map(repo => {
                        const repository = new Repository(repo.full_name);
                        organization.addRepository(repository);
                    });
                });
                return organization;
            })
        );
    }

    getRemainingPages(resp, baseUri) {
        return super.getRemainingPages(resp, baseUri);
    }
}