import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Contributor } from './contributor.model';
import { Observable, of, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Repository } from '../repository/repository.model';


@Injectable({
providedIn: 'root'
})
export class ContributorService {

    constructor(private client: HttpClient) { }

    getContributorRepos(contributor: Contributor): Observable<Contributor> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer 6ba278712f38dc6b05d8ac4c2203b4f4b107e48e'
          })
        return this.client.get<any>(`https://api.github.com/users/${contributor.username}/repos?per_page=100`, { headers, observe: 'response'})
        .pipe(
            map(response => {
                response.body.forEach(repo => contributor.addRepository(repo));
                return contributor;
            })
        );
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