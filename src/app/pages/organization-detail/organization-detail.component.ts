import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Organization } from '../../core/domain/organization/organization.model';
import { SortableCollection } from '../../shared/presentation-components/sortable-table/sortable.collection';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { StateService } from '../../core/state/state.service';

@Component({
  selector: 'app-organization-detail',
  templateUrl: './organization-detail.component.html'
})
export class OrganizationDetailComponent implements OnInit {
  organization = new Organization('angular');
  contributorCollection = new SortableCollection({active: 'contributions', direction: 'desc'});
  contributorCollection$: Observable<SortableCollection>;
  organization$: Observable<Organization>;
  repoCounter$: Observable<number>;
  contributorCounter$: Observable<number>;

  constructor(private state: StateService, private router: Router) {}

  ngOnInit() {
    this.state.selectOrganization(this.organization);
    this.organization$ = this.state.selectedOrganization$;
    this.contributorCollection$ = this.state.selectedOrganization$
      .pipe(
        map(organization => {
          this.contributorCollection.items = organization.contributors;
          return this.contributorCollection;
        })
      );
  }

  onItemSelected($event) {
    this.state.selectContributor($event);
    this.router.navigate(['/contributor']);
  }

}
