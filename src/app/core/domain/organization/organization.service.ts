import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Organization } from './organization.model';
import { map } from 'rxjs/operators';
import { github } from 'src/config/github';

@Injectable({
    providedIn: 'root'
})
export class OrganizationService {
    constructor(protected client: HttpClient) { }

    getOne(organizationName: string): Observable<Organization> {
        return this.client.get<any>(`${github.baseUrl}/orgs/${organizationName}`, {headers: github.headers})
            .pipe(
                map(response => new Organization(response.id, response.login))
            );
    }
}