import { Component, OnInit } from '@angular/core';
import { RepositoryService } from '../core/domain/repository/repository.service';
import { Observable } from 'rxjs';
import { Repository } from '../core/domain/repository/repository.model';
import { StateService } from '../core/state/state.service';
import { Router } from '@angular/router';
import { SortableCollection } from '../core/sortable.collection';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-repository-detail',
  templateUrl: './repository-detail.component.html'
})
export class RepositoryDetailComponent implements OnInit {
  repository$: Observable<Repository>;
  contributors$: Observable<SortableCollection>;
  constructor(private service: RepositoryService, private state: StateService, private router: Router) { }

  ngOnInit() {
    this.repository$ = this.state.repo$;
    this.state.repo$.subscribe(repo => {
      if (!repo) {
        this.router.navigate(['']);
      }
      this.contributors$ = this.service.getRepoContributors(repo)
        .pipe(
          map(repo => new SortableCollection(repo.contributors))
        );
    });
  }

  onItemSelected($event) {
    this.state.selectContributor($event);
    this.router.navigate(['/contributor']);
  }
}
