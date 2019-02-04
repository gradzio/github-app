import { NgModule } from '@angular/core';
import { MaterialModule } from './material.module';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { SimpleListComponent } from './presentation-components/simple-list/simple-list.component';
import { BusinessCardComponent } from './presentation-components/business-card/business-card.component';
import { RepositoryContributorsTableComponent } from './smart-components/sortable-table/repository-contributors-table.component';
import { SortableTableComponent } from './smart-components/sortable-table/sortable-table.component';
import { OrganizationContributorsTableComponent } from './smart-components/sortable-table/organization-contributors-table.component';

@NgModule({
    declarations: [
        SortableTableComponent,
        OrganizationContributorsTableComponent,
        RepositoryContributorsTableComponent,
        SimpleListComponent,
        BusinessCardComponent
    ],
    imports: [
        BrowserModule,
        RouterModule,
        MaterialModule
    ],
    exports: [
        SortableTableComponent,
        SimpleListComponent,
        BusinessCardComponent,
        OrganizationContributorsTableComponent,
        RepositoryContributorsTableComponent,
    ]
})

export class SharedModule {}