import { HttpHeaders, HttpClient } from '@angular/common/http';
import { of, forkJoin } from 'rxjs';
import { LinkHeaderParser } from './link-header.parser';

export class PaginatedService {
    protected perPage = 100;
    protected page = 1;
    constructor(protected client: HttpClient, protected parser: LinkHeaderParser) { }

    getRemainingPages(resp, baseUri) {
        const pagination = this.parser.parse(resp.headers);
        const allCalls = [of(resp)];
        if (pagination && pagination.last) {
            for(let i = 2; i <= <number><any>pagination.last.page; i++ ) {
                allCalls.push(this.client.get(`${baseUri}?per_page=${this.perPage}&page=${i}`, {
                    headers: new HttpHeaders({
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer 6ba278712f38dc6b05d8ac4c2203b4f4b107e48e'
                    }),
                    observe: 'response'
                }));
            }
            return forkJoin(allCalls);
        }
        return of([resp]);
    }
}