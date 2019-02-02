import { Component, OnInit } from '@angular/core';
import { Contributor } from '../../core/domain/contributor/contributor.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { StateService } from '../../core/state/state.service';
import { ContributorDetailVM } from './contributor-detail.viewmodel';

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
        map((contributor: Contributor) => new ContributorDetailVM(contributor))
      );
  }

  onItemSelected($event) {
    this.state.selectRepo($event);
    this.router.navigate(['/repo']);
  }
}
