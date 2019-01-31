import { Component, OnInit } from '@angular/core';
import { RepositoryService } from '../core/domain/repository/repository.service';
import { Observable } from 'rxjs';
import { Repository } from '../core/domain/repository/repository.model';
import { StateService } from '../core/state/state.service';
import { Router } from '@angular/router';
import { SortableCollection } from '../core/sortable.collection';
import { map } from 'rxjs/operators';
import { ItemVM } from '../shared/presentation-components/item.viewmodel';

@Component({
  selector: 'app-repository-detail',
  templateUrl: './repository-detail.component.html'
})
export class RepositoryDetailComponent implements OnInit {
  repository$: Observable<ItemVM>;
  contributors$: Observable<SortableCollection>;
  collection = new SortableCollection({active: 'contributions', direction: 'desc'});
  constructor(private service: RepositoryService, private state: StateService, private router: Router) { }

  ngOnInit() {
    this.repository$ = this.state.repo$
    .pipe(
      map((repository: Repository) => {
        return {title: repository.organization, subtitle: repository.name}
      })
    );
    this.contributors$ = this.state.repoContributors$;
    this.state.repo$.subscribe(repo => {
      if (!repo) {
        this.router.navigate(['']);
      }
    });
  }

  onItemSelected($event) {
    this.state.selectContributor($event);
    this.router.navigate(['/contributor']);
  }
}
