import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Organization } from '../../core/domain/organization/organization.model';
import { SortableCollection } from '../../shared/presentation-components/simple-list/sortable.collection';
import { map, debounceTime } from 'rxjs/operators';
import { Router } from '@angular/router';
import { StateService } from '../../core/state/state.service';
import { AvatarItem, SimpleItem } from 'src/app/shared/github.viewmodel';
import { Repository } from 'src/app/core/domain/repository/repository.model';

@Component({
  selector: 'app-organization-detail',
  templateUrl: './organization-detail.component.html'
})
export class OrganizationDetailComponent implements OnInit {
  contributorCollection = new SortableCollection<AvatarItem>({active: 'count', direction: 'desc'});
  contributorCollection$: Observable<SortableCollection<AvatarItem>>;

  repoCollection = new SortableCollection<SimpleItem>({active: 'count', direction: 'desc'});
  repoCollection$: Observable<SortableCollection<SimpleItem>>;

  organization$: Observable<Organization>;
  
  constructor(private state: StateService, private router: Router) {}

  ngOnInit() {
    this.organization$ = this.state.selectedOrganization$;
    
    this.contributorCollection$ = this.state.selectedOrganization$
      .pipe(
        map(organization => {
          this.contributorCollection.items = organization.repoContributors
            .map(contributor => {
              return {
                avatarUrl: contributor.avatarUrl,
                name: contributor.username,
                count: contributor.contributions
              }
            });
          return this.contributorCollection;
        })
      );

    this.repoCollection$ = this.state.selectedOrganization$
      .pipe(
        map(organization => {
          this.repoCollection.items = organization.repositories
            .map((repo: Repository) => {
              return {
                name: repo.name,
                avatarUrl: organization.avatarUrl,
                count: repo.total('contributions')
              }
            });
          return this.repoCollection;
        })
      );
  }

  onContributorSelected($event) {
    this.state.selectContributor($event);
    this.router.navigate(['/contributor']);
  }

}
