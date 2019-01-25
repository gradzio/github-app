import { Component, OnInit } from '@angular/core';
import { ContributorService } from '../core/domain/contributor/contributor.service';
import { Contributor } from '../core/domain/contributor/contributor.model';
import { Observable } from 'rxjs';
import { map, tap, switchMap } from 'rxjs/operators';
import { SortableCollection } from '../core/sortable.collection';
import { ActivatedRoute, Router } from '@angular/router';
import { StateService } from '../core/state/state.service';

@Component({
  selector: 'app-contributor-detail',
  templateUrl: './contributor-detail.component.html'
})
export class ContributorDetailComponent implements OnInit {

  contributor$: Observable<Contributor>;
  contributorRepos$;
  
  constructor(private service: ContributorService, private state: StateService, private router: Router) { }

  ngOnInit() {
    this.contributor$ = this.state.contributor$;
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
