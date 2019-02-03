import { SortableTableComponent } from './sortable-table.component';
import { Component } from '@angular/core';
import { filter, map } from 'rxjs/operators';
import { StateService } from 'src/app/core/state/state.service';
import { Repository } from 'src/app/core/domain/repository/repository.model';

@Component({
    selector: 'app-repository-contributors-table',
    templateUrl: './sortable-table.component.html'
})
export class RepositoryContributorsTableComponent extends SortableTableComponent {
    constructor(protected state: StateService) {
        super(state);
    }
    loadData() {
        this.state.selectedRepo$
            .pipe(
                map((repo: Repository) => {
                this.dataSource.data =  repo.contributors;
                })
            ).subscribe();
    }
}