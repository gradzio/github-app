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
   
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Repository> {
        const repo = new Repository(route.params.name);
        this.stateService.selectRepo(repo);
        return of(repo);
    }
  }