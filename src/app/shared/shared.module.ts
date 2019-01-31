import { SortableTableComponent } from "./presentation-components/sortable-table/sortable-table.component";
import { NgModule } from '@angular/core';
import { MaterialModule } from './material.module';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { SimpleListComponent } from './presentation-components/simple-list/simple-list.component';
import { BusinessCardComponent } from './presentation-components/business-card/business-card.component';

@NgModule({
    declarations: [
        SortableTableComponent,
        SimpleListComponent,
        BusinessCardComponent
    ],
    imports: [
        BrowserModule,
        MaterialModule,
        RouterModule
    ],
    exports: [
        SortableTableComponent,
        SimpleListComponent,
        BusinessCardComponent,
        MaterialModule
    ]
})

export class SharedModule {}