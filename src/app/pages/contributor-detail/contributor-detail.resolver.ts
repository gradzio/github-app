import { Injectable } from '@angular/core';
import { StateService } from '../../core/state/state.service';
import { Resolve, Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, EMPTY, of } from 'rxjs';
import { Contributor } from 'src/app/core/domain/contributor/contributor.model';

@Injectable({
    providedIn: 'root',
})
export class ContributorDetailResolverService implements Resolve<Contributor> {
constructor(private stateService: StateService, private router: Router) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Contributor> {
        const contributor = new Contributor(0, route.params.name, 0);
        this.stateService.selectContributor(contributor);
        return of(contributor);
    }
}