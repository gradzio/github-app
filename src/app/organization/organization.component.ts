import { Component, OnInit } from '@angular/core';
import { RepositoryService } from '../core/domain/repository/repository.service';
import { Repository } from '../core/domain/repository/repository.model';
import { Observable } from 'rxjs';
import { LinkHeaderParser, Parser } from '../core/pagination/link-header.parser';
import { HttpHeaders } from '@angular/common/http';
import { Contributor } from '../core/domain/contributor/contributor.model';
import { OrganizationService } from '../core/domain/organization/organization.service';
import { Organization } from '../core/domain/organization/organization.model';
import { SortableCollection } from '../core/sortable.collection';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { StateService } from '../core/state/state.service';
import { StoreService } from '../core/state/store.service';

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html'
})
export class OrganizationComponent implements OnInit {
  organization = new Organization('angular');
  contributorCollection = new SortableCollection({active: 'contributions', direction: 'desc'});
  contributorCollection$: Observable<SortableCollection>;
  organization$: Observable<Organization>;
  repoCounter$: Observable<number>;
  contributorCounter$: Observable<number>;

  constructor(public store: StoreService, private service: OrganizationService, private state: StateService, private router: Router) {}

  ngOnInit() {
    // this.service.getRepoContributors(this.repository).subscribe(resp => {
    //   console.log(resp);
    // });
    this.repoCounter$ = this.store.repoCounter$;
    this.contributorCounter$ = this.store.contributorCounter$;
    this.organization$ = this.store.organization$;
    // this.contributors$ = this.service.organization$.pipe(map(organization => new SortableCollection(organization.contributors)));
    this.contributorCollection$ = this.store.organization$
      .pipe(
        map(organization => {
          this.contributorCollection.items = organization.contributors;
          return this.contributorCollection;
        })
      );
  }

  onItemSelected($event) {
    this.store.loadContributorsPageSubject
    this.state.selectContributor($event);
    this.router.navigate(['/contributor']);
  }

}
