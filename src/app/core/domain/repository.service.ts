import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Repository } from './repository.model';
import { Contributor } from './contributor.model';

@Injectable({
    providedIn: 'root'
})
export class RepositoryService {
    constructor(private client: HttpClient) { }

    getRepoContributors(repository: Repository): Observable<Contributor[]> {
        return this.client.get<Contributor[]>(`https://api.github.com/repos/${repository.organization}/${repository.name}/contributors`);
    }
}