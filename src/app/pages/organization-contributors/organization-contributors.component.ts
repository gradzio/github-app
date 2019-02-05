import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Organization } from '../../core/domain/organization/organization.model';
import { SortableCollection } from '../../shared/presentation-components/simple-list/sortable.collection';
import { map, debounceTime, filter } from 'rxjs/operators';
import { Router } from '@angular/router';
import { StateService } from '../../core/state/state.service';
import { Contributor } from 'src/app/core/domain/contributor/contributor.model';

@Component({
  selector: 'app-organization-contributors',
  templateUrl: './organization-contributors.component.html'
})
export class OrganizationContributorsComponent implements OnInit {
  organization$: Observable<Organization>;
  repoContributorData: Contributor[] = [];

  constructor(private state: StateService, private router: Router) {}

  ngOnInit() {
    this.organization$ = this.state.selectedOrganization$;
    this.state.loadMissingContributorDetails();
  }

  onItemSelected(contributor: Contributor) {
    this.router.navigate(['/contributors', contributor.username]);
  }

}
