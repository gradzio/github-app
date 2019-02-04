import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Repository } from '../../core/domain/repository/repository.model';
import { StateService } from '../../core/state/state.service';
import { Router, ActivatedRoute } from '@angular/router';
import { map, debounceTime, filter } from 'rxjs/operators';
import { RepositoryDetailVM } from './repository-detail.viewmodel';
import { Contributor } from 'src/app/core/domain/contributor/contributor.model';

@Component({
  selector: 'app-repository-detail',
  templateUrl: './repository-detail.component.html'
})
export class RepositoryDetailComponent implements OnInit {

  repositoryVM$: Observable<RepositoryDetailVM>;
  contributorData: Contributor[] = [];

  constructor(private route: ActivatedRoute, private state: StateService, private router: Router) { }

  ngOnInit() {
    this.repositoryVM$ = this.state.selectedRepo$
    .pipe(
      filter((repository: Repository) => repository !== null && repository.isLoaded),
      map((repository: Repository) => {
        this.contributorData = repository.contributors;
        return new RepositoryDetailVM(repository);
      })
    );
  }

  onItemSelected(contributor: Contributor) {
    this.router.navigate(['/contributors', contributor.username]);
  }
}
