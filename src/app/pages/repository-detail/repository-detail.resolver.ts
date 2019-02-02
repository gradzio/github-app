import { Injectable } from '@angular/core';
import { StateService } from '../../core/state/state.service';
import { Resolve, Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Repository } from '../../core/domain/repository/repository.model';
import { Observable, EMPTY, of } from 'rxjs';
import { mergeMap, take, map, switchMap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
  })
  export class RepositoryDetailResolverService implements Resolve<Repository> {
    constructor(private stateService: StateService, private router: Router) {}
   
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Repository> | Observable<never> {
        return this.stateService.selectedRepo$.pipe(
            take(1),
            mergeMap(repo => {
                if (!repo) {
                    this.router.navigate(['']);
                    return EMPTY;
                }
                return of(repo);
            })
        );
    }
  }