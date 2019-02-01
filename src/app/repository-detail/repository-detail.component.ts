import { Component, OnInit } from '@angular/core';
import { RepositoryService } from '../core/domain/repository/repository.service';
import { Observable } from 'rxjs';
import { Repository } from '../core/domain/repository/repository.model';
import { StateService } from '../core/state/state.service';
import { Router } from '@angular/router';
import { SortableCollection } from '../core/sortable.collection';
import { map, filter } from 'rxjs/operators';
import { ItemVM } from '../shared/presentation-components/item.viewmodel';

@Component({
  selector: 'app-repository-detail',
  templateUrl: './repository-detail.component.html'
})
export class RepositoryDetailComponent implements OnInit {
  repositoryVM$: Observable<ItemVM>;
  contributorCollection = new SortableCollection({active: 'contributions', direction: 'desc'});
  contributorCollection$: Observable<SortableCollection>;
  test$;
  constructor(private state: StateService, private router: Router) { }

  ngOnInit() {
    this.test$ = this.state.selectedRepo$;
    this.repositoryVM$ = this.state.selectedRepo$
      .pipe(
        filter(repository => repository),
        map((repository: Repository) => {
          return {title: repository.organization, subtitle: repository.name}
        })
      );
    this.contributorCollection$ = this.state.selectedRepo$
      .pipe(
        filter(repository => repository),
        map(repo => {
          this.contributorCollection.items = repo.contributors;
          return this.contributorCollection;
        })
      );
    this.state.selectedRepo$.subscribe(repo => {
      if (!repo) {
        return this.router.navigate(['']);
      }
    });
  }

  onItemSelected($event) {
    this.state.selectContributor($event);
    this.router.navigate(['/contributor']);
  }
}
