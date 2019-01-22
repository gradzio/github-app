import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Contributor } from './contributor.model';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Repository } from './repository.model';


@Injectable({
providedIn: 'root'
})
export class ContributorService {

    constructor(private client: HttpClient) { }

    getContributorRepos(contributor: Contributor): Observable<Repository[]> {
        return this.client.get<Repository[]>(`https://api.github.com/users/${contributor.username}/repos`);
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