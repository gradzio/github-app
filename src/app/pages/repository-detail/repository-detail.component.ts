import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Repository } from '../../core/domain/repository/repository.model';
import { StateService } from '../../core/state/state.service';
import { Router, ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { RepositoryDetailVM } from './repository-detail.viewmodel';

@Component({
  selector: 'app-repository-detail',
  templateUrl: './repository-detail.component.html'
})
export class RepositoryDetailComponent implements OnInit {

  repositoryVM$: Observable<RepositoryDetailVM>;

  constructor(private route: ActivatedRoute, private state: StateService, private router: Router) { }

  ngOnInit() {
    this.repositoryVM$ = this.state.selectedRepo$
    .pipe(
      map((repository: Repository) => new RepositoryDetailVM(repository))
    );
  }

  onItemSelected($event) {
    this.state.selectContributor($event);
    this.router.navigate(['/contributor']);
  }
}
