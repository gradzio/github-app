import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Contributor } from './contributor.model';
import { Observable, of, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Repository } from '../repository/repository.model';
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

    getContributorRepos(contributor: Contributor): Observable<Contributor> {
        const baseUri = `${github.baseUrl}/users/${contributor.username}/repos`;
        return this.client.get<any>(`${baseUri}?page=${this.page}&per_page=${this.perPage}`, { headers: github.headers, observe: 'response'})
        .pipe(
            switchMap((resp:any) => this.getRemainingPages(resp, baseUri)),
            map((allResponses: any) => {
                allResponses
                .filter(response => response.body)
                .forEach(response => {
                    response.body.forEach(repo => contributor.addRepository(new Repository(repo.full_name)));
                });
                return contributor;
            })
        );
    }

    getContributorsDetails(contributorNames: string[]) {
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

    getRemainingPages(resp, baseUri) {
        return super.getRemainingPages(resp, baseUri);
    }

    getOne(contributor: Contributor): Observable<Contributor> {
        // return forkJoin(
            // this.client.get<any[]>(`https://api.github.com/users/${contributor.username}/repos`),
            // this.client.get<any[]>(`https://api.github.com/users/${contributor.username}/followers`),
            // this.client.get<any[]>(`https://api.github.com/users/${contributor.username}/gists`),
            return this.client.get<any>(`${github.baseUrl}/users/${contributor.username}`, {
                headers: github.headers})
            .pipe(
            map(response => {
                contributor.followers = response.followers;
                contributor.gists = response.public_gists;
                contributor.repoCount = response.public_repos;
                // responses[0].forEach(repoData => {
                //     contributor.addRepository(new Repository(repoData.full_name));
                // });
                // contributor.id = responses[3].id;
                return contributor;
            })
        );
    }
}