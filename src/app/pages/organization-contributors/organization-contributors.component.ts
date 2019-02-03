import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Organization } from '../../core/domain/organization/organization.model';
import { SortableCollection } from '../../shared/presentation-components/simple-list/sortable.collection';
import { map, debounceTime } from 'rxjs/operators';
import { Router } from '@angular/router';
import { StateService } from '../../core/state/state.service';
import { Contributor } from 'src/app/core/domain/contributor/contributor.model';
import { MatTableDataSource, MatPaginator } from '@angular/material';

@Component({
  selector: 'app-organization-contributors',
  templateUrl: './organization-contributors.component.html'
})
export class OrganizationContributorsComponent implements OnInit {
  organization$: Observable<Organization>;
  contributorData: Contributor[] = [];

  constructor(private state: StateService, private router: Router) {}

  ngOnInit() {
    this.organization$ = this.state.selectedOrganization$
      .pipe(
        debounceTime(2000),
        map(organization => {
          this.contributorData = organization.contributors
          return organization;
        })
      );
  }

  onItemSelected($event) {
    this.state.selectContributor($event);
    this.router.navigate(['/contributor']);
  }

}
