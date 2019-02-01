import { Component, OnInit } from '@angular/core';
import { ContributorService } from '../core/domain/contributor/contributor.service';
import { Contributor } from '../core/domain/contributor/contributor.model';
import { Observable } from 'rxjs';
import { map, tap, switchMap } from 'rxjs/operators';
import { SortableCollection } from '../core/sortable.collection';
import { ActivatedRoute, Router } from '@angular/router';
import { StateService } from '../core/state/state.service';
import { ItemVM } from '../shared/presentation-components/item.viewmodel';
import { StoreService } from '../core/state/store.service';
import { Repository } from '../core/domain/repository/repository.model';

@Component({
  selector: 'app-contributor-detail',
  templateUrl: './contributor-detail.component.html'
})
export class ContributorDetailComponent implements OnInit {

  contributorVM$: Observable<ItemVM>;
  contributorRepos$: Observable<Repository[]>;
  
  constructor(private state: StateService, private router: Router) { }

  ngOnInit() {
    this.contributorVM$ = this.state.selectedContributor$
      .pipe(
        map((contributor: Contributor) => {
          const details = [];
          if (contributor.followers) {
            details.push('Followers: ' + contributor.followers);
          }
          if (contributor.repoCount) {
            details.push('Repositories: ' + contributor.repoCount);
          }
          if (contributor.gists) {
            details.push('Gists: ' + contributor.gists);
          }
          return {image: contributor.avatarUrl, title: contributor.username, details}
        })
      );
      this.contributorRepos$ = this.state.selectedContributor$
        .pipe(
          map((contributor: Contributor) => contributor.repositories)
        );
    this.state.selectedContributor$.subscribe(contributor => {
      if (!contributor) {
        return this.router.navigate(['']);
      }
    });
  }

  onItemSelected($event) {
    this.state.selectRepo($event);
    this.router.navigate(['/repo']);
  }
}
