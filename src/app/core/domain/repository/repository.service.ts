import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, pipe, EMPTY, forkJoin, of } from 'rxjs';
import { Repository } from './repository.model';
import { Contributor } from '../contributor/contributor.model';
import { expand, map, reduce, switchMap } from 'rxjs/operators';
import { LinkHeaderParser } from '../../pagination/link-header.parser';

@Injectable({
    providedIn: 'root'
})
export class RepositoryService {
    constructor(private client: HttpClient, private parser: LinkHeaderParser) { }

    getRepoContributors(repository: Repository) {
        const perPage = 100;
        const page = 1;
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer 6ba278712f38dc6b05d8ac4c2203b4f4b107e48e'
          })
        return this.client.get(`https://api.github.com/repos/${repository.organization}/${repository.name}/contributors?per_page=${perPage}&page=${page}`, {headers, observe: 'response'})
        .pipe(
            switchMap((resp:any) => {
                const pagination = this.parser.parse(resp.headers);
                const allCalls = [of(resp)];
                if (pagination && pagination.last) {
                    for(let i = 2; i <= <number><any>pagination.last.page; i++ ) {
                        allCalls.push(this.client.get(`https://api.github.com/repos/${repository.organization}/${repository.name}/contributors?per_page=${perPage}&page=${i}`, {headers, observe: 'response'}));
                    }
                    return forkJoin(allCalls);
                }
                return of([resp]);
            }),
            map((allResponses: any) => {
                allResponses.forEach(response => {
                    repository.addContributors(response.body);
                });
                return repository;
            })
        )
    }
}