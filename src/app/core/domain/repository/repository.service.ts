import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Repository } from './repository.model';
import { Contributor } from '../contributor/contributor.model';
import { expand, map, reduce, switchMap } from 'rxjs/operators';
import { LinkHeaderParser } from '../../pagination/link-header.parser';
import { PaginatedService } from '../../pagination/paginated.service';
import { github } from 'src/config/github';

@Injectable({
    providedIn: 'root'
})
export class RepositoryService extends PaginatedService {
    protected perPage;
    constructor(protected client: HttpClient, protected parser: LinkHeaderParser) {
        super(client, parser);
    }
    getRepoContributors(repository: Repository) {
        this.page = 1;
        const baseUri = `${github.baseUrl}/repos/${repository.fullName}/contributors`;
        return this.client.get(`${baseUri}?per_page=${this.perPage}&page=${this.page}`, {
            headers: github.headers,
            observe: 'response'
        })  
        .pipe(
            switchMap((resp:any) => this.getRemainingPages(resp, baseUri)),
            map((allResponses: any) => {
                allResponses.forEach(response => {
                    repository.addContributors(response.body.map(contributor => {
                        const contributorObject = new Contributor(contributor.id, contributor.login, contributor.contributions);
                        return contributorObject;
                    }))
                });
                return repository;
            })
        )
    }
    getRemainingPages(resp, baseUri) {
        return super.getRemainingPages(resp, baseUri);
    }
}