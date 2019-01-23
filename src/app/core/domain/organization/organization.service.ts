import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { Repository } from '../repository/repository.model';
import { Contributor } from '../contributor/contributor.model';
import { Organization } from './organization.model';
import { switchMap, map, tap } from 'rxjs/operators';
import { all } from 'q';

@Injectable({
    providedIn: 'root'
})
export class OrganizationService {
    constructor(private client: HttpClient) { }

    getOrganizationContributors(organization: Organization) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer 6ba278712f38dc6b05d8ac4c2203b4f4b107e48e'
          })
        return this.client.get<any>(`https://api.github.com/orgs/${organization.name}/repos?per_page=100`, {headers})
        .pipe(
            switchMap(response => {
                const allCalls = response.map(repo => this.client.get(`https://api.github.com/repos/${repo.full_name}/contributors?per_page=1000`, {headers}));
                return forkJoin(allCalls);
            }),
            map(allResponses => {
                allResponses.forEach((contributors: any[]) => 
                    contributors.forEach(contributor => 
                        organization.addContributor(new Contributor(contributor.id, contributor.login))
                    )
                );
                return organization;
            })
        );
    }
}