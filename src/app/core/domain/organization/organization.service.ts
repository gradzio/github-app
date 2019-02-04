import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, BehaviorSubject, of, from, Observable } from 'rxjs';
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
export class OrganizationService extends PaginatedService {
    protected perPage;
    protected page;
    constructor(protected client: HttpClient, protected parser: LinkHeaderParser) {
        super(client, parser);
    }

    getOne(organizationName: string): Observable<Organization> {
        return this.client.get<any>(`${github.baseUrl}/orgs/${organizationName}`, {headers: github.headers, observe: 'response'})
            .pipe(
                filter(response => response.body),
                map(response => new Organization(response.body.id, response.body.login))
            );
    }

    getRemainingPages(resp, baseUri) {
        return super.getRemainingPages(resp, baseUri);
    }
}