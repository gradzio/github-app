import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Organization } from '../../core/domain/organization/organization.model';
import { SortableCollection } from '../../shared/presentation-components/simple-list/sortable.collection';
import { map, debounceTime, filter } from 'rxjs/operators';
import { Router } from '@angular/router';
import { StateService } from '../../core/state/state.service';
import { AvatarItem, SimpleItem } from 'src/app/shared/github.viewmodel';
import { Repository } from 'src/app/core/domain/repository/repository.model';

@Component({
  selector: 'app-organization-repos',
  templateUrl: './organization-repos.component.html'
})
export class OrganizationReposComponent implements OnInit {
  repoCollection = new SortableCollection<SimpleItem>({active: 'count', direction: 'desc'});
  repoCollection$: Observable<SortableCollection<SimpleItem>>;

  constructor(private state: StateService, private router: Router) {}

  ngOnInit() {
    this.repoCollection$ = this.state.selectedOrganization$
      .pipe(
        filter((organization: Organization) => organization.hasLoadedAllRepos),
        map(organization => {
          this.repoCollection.items = organization.repositories
            .map((repo: Repository) => {
              return {
                name: repo.name,
                description: repo.organization,
                count: repo.total('contributions')
              }
            });
          return this.repoCollection;
        })
      );
  }

  onItemSelected($event: SimpleItem) {
      this.state.selectRepo(new Repository($event.description + '/' + $event.name));
      this.router.navigate(['/repo']);
  }

}
