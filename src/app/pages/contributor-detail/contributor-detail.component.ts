import { Component, OnInit } from '@angular/core';
import { Contributor } from '../../core/domain/contributor/contributor.model';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { StateService } from '../../core/state/state.service';
import { ContributorDetailVM } from './contributor-detail.viewmodel';
import { Repository } from 'src/app/core/domain/repository/repository.model';

@Component({
  selector: 'app-contributor-detail',
  templateUrl: './contributor-detail.component.html'
})
export class ContributorDetailComponent implements OnInit {

  contributorVM$: Observable<ContributorDetailVM>;
  
  constructor(private route: ActivatedRoute, private state: StateService, private router: Router) { }

  ngOnInit() {
    this.contributorVM$ = this.state.selectedContributor$
      .pipe(
        filter((contributor: Contributor) => contributor && contributor.isLoaded && !contributor.isNotComplete),
        map((contributor: Contributor) => {
          return new ContributorDetailVM(contributor)
        })
      );
  }

  onItemSelected(repository: Repository) {
    this.router.navigate(['/repos', repository.fullName]);
  }
}
