import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Contributor } from './contributor.model';
import { Observable, of, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { PaginatedService } from '../../pagination/paginated.service';
import { LinkHeaderParser } from '../../pagination/link-header.parser';
import { github } from 'src/config/github';


@Injectable({
providedIn: 'root'
})
export class ContributorService extends PaginatedService {
    protected perPage = 100;
    protected page;
    constructor(protected client: HttpClient, protected parser: LinkHeaderParser) {
        super(client, parser);
    }

    getContributorsDetails(contributorNames: string[]) {
        this.page = 1;
        const firstName = contributorNames.shift();

        return this.client.get<any>(`${github.baseUrl}/users/${firstName}`, {headers: github.headers, observe: 'response'})
        .pipe(
            switchMap( response => {
                const allCalls$ = [of(response)];
                contributorNames
                    .forEach(contributorName => {
                        allCalls$.push(this.client.get<any>(`${github.baseUrl}/users/${contributorName}`, {headers: github.headers, observe: 'response'}));
                    });
                return forkJoin(allCalls$);
            }),
            map((responses: any) => {
                return responses.map(response => response.body);
            })
        )
    }

    getAllByRepoFullName(repoFullName: string): Observable<Contributor[]> {
        this.page = 1;
        const baseUri = `${github.baseUrl}/repos/${repoFullName}/contributors`;
        return this.client.get(`${baseUri}?per_page=${this.perPage}&page=${this.page}`, {
            headers: github.headers,
            observe: 'response'
        })
        .pipe(
            switchMap((resp:any) => this.getRemainingPages(resp, baseUri)),
            map((allResponses: any) => {
                const contributors = [];
                allResponses
                    .filter(response => response.body)
                    .forEach(response => {
                        response.body.forEach(contributor => contributors.push(new Contributor(contributor.id, contributor.login, contributor.contributions)))
                    });
                
                return contributors;
            })
        )
    }

    getRemainingPages(resp, baseUri) {
        return super.getRemainingPages(resp, baseUri);
    }

    getOne(contributorName: string): Observable<Contributor> {
            return this.client.get<any>(`${github.baseUrl}/users/${contributorName}`, {headers: github.headers})
            .pipe(
            map(response => {
                const contributor = new Contributor(response.id, response.login, 0);
                contributor.followers = response.followers;
                contributor.gists = response.public_gists;
                contributor.repoCount = response.public_repos;
                return contributor;
            })
        );
    }
}