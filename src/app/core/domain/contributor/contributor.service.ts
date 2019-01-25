import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Contributor } from './contributor.model';
import { Observable, of, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Repository } from '../repository/repository.model';
import { PaginatedService } from '../../pagination/paginated.service';
import { LinkHeaderParser } from '../../pagination/link-header.parser';


@Injectable({
providedIn: 'root'
})
export class ContributorService extends PaginatedService {
    protected perPage = 5;
    protected page;
    constructor(protected client: HttpClient, protected parser: LinkHeaderParser) {
        super(client, parser);
    }

    getContributorRepos(contributor: Contributor): Observable<Repository[]> {
        const baseUri = `https://api.github.com/users/${contributor.username}/repos`;
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer 6ba278712f38dc6b05d8ac4c2203b4f4b107e48e'
          })
        return this.client.get<any>(`${baseUri}?page=${this.page}&per_page=${this.perPage}`, { headers, observe: 'response'})
        .pipe(
            switchMap((resp:any) => this.getRemainingPages(resp, baseUri)),
            map((allResponses: any) => {
                const repos = [];
                allResponses
                .filter(response => response.body)
                .forEach(response => {
                    response.body.forEach(repo => repos.push(new Repository(repo.full_name)));
                });
                return repos;
            })
        );
    }

    getRemainingPages(resp, baseUri) {
        return super.getRemainingPages(resp, baseUri);
    }

    getOne(contributor: Contributor): Observable<Contributor> {
        // return forkJoin(
            // this.client.get<any[]>(`https://api.github.com/users/${contributor.username}/repos`),
            // this.client.get<any[]>(`https://api.github.com/users/${contributor.username}/followers`),
            // this.client.get<any[]>(`https://api.github.com/users/${contributor.username}/gists`),
            return this.client.get<any>(`https://api.github.com/users/${contributor.username}`)
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