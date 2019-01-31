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

@Component({
  selector: 'app-contributor-detail',
  templateUrl: './contributor-detail.component.html'
})
export class ContributorDetailComponent implements OnInit {

  contributor$: Observable<ItemVM>;
  contributorRepos$;
  
  constructor(private service: ContributorService, private state: StateService, private router: Router) { }

  ngOnInit() {
    this.contributor$ = this.state.contributor$
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
    this.state.contributor$.subscribe(contributor => {
      if (!contributor) {
        this.router.navigate(['']);
      }
      this.contributorRepos$ = this.service.getContributorRepos(contributor)
    });
  }

  onItemSelected($event) {
    this.state.selectRepo($event);
    this.router.navigate(['/repo']);
  }
}
