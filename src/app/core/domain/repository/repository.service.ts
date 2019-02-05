import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Repository } from './repository.model';
import { Contributor } from '../contributor/contributor.model';
import { expand, map, reduce, switchMap, filter } from 'rxjs/operators';
import { LinkHeaderParser } from '../../pagination/link-header.parser';
import { PaginatedService } from '../../pagination/paginated.service';
import { github } from 'src/config/github';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class RepositoryService extends PaginatedService {
    protected perPage;
    constructor(protected client: HttpClient, protected parser: LinkHeaderParser) {
        super(client, parser);
    }
    getAllByOrganizationName(organizationName: string): Observable<Repository[]> {
        const baseUri = `${github.baseUrl}/orgs/${organizationName}/repos`;
        return this.client.get<any>(`${baseUri}?per_page=${this.perPage}&page=${this.page}`, {headers: github.headers, observe: 'response'})
        .pipe(
            switchMap(resp => this.getRemainingPages(resp, baseUri)),
            map(allResponses => this.proessAllResponses(allResponses))
        );
    }

    getAllByContributorName(contributorName: string): Observable<Repository[]> {
        const baseUri = `${github.baseUrl}/users/${contributorName}/repos`;
        return this.client.get<any>(`${baseUri}?page=${this.page}&per_page=${this.perPage}`, { headers: github.headers, observe: 'response'})
        .pipe(
            switchMap((resp:any) => this.getRemainingPages(resp, baseUri)),
            map((allResponses: any) => this.proessAllResponses(allResponses))
        );
    }

    private proessAllResponses(allResponses): Repository[] {
        const repos = [];
        allResponses
            .filter(response => response.body)
            .forEach(response => {
                response.body.forEach(repo => repos.push(new Repository(repo.full_name)));
            });
        return repos;
    }

    getRemainingPages(resp, baseUri) {
        return super.getRemainingPages(resp, baseUri);
    }
}