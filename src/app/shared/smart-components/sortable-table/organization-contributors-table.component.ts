import { SortableTableComponent } from './sortable-table.component';
import { Component } from '@angular/core';
import { Organization } from 'src/app/core/domain/organization/organization.model';
import { filter, map } from 'rxjs/operators';
import { StateService } from 'src/app/core/state/state.service';

@Component({
    selector: 'app-organization-contributors-table',
    templateUrl: './sortable-table.component.html'
})
export class OrganizationContributorsTableComponent extends SortableTableComponent {
    constructor(protected state: StateService) {
        super(state);
    }

    loadData() {
        this.state.selectedOrganization$
            .pipe(
                filter((organization: Organization) => organization !== null),
                map((organization: Organization) => {
                    this.dataSource.data =  organization.repoContributors;
                })
            ).subscribe();
    }
}