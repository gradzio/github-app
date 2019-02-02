import { Injectable } from '@angular/core';
import { StateService } from '../../core/state/state.service';
import { Resolve, Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Repository } from '../../core/domain/repository/repository.model';
import { Observable, EMPTY, of } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';
import { Contributor } from 'src/app/core/domain/contributor/contributor.model';

@Injectable({
    providedIn: 'root',
})
export class ContributorDetailResolverService implements Resolve<Contributor> {
constructor(private stateService: StateService, private router: Router) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Contributor> | Observable<never> {
        return this.stateService.selectedContributor$.pipe(
            take(1),
            mergeMap(contributor => {
                if (!contributor) {
                    this.router.navigate(['']);
                    return EMPTY;
                }
                return of(contributor);
            })
        );
    }
}