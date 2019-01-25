import { Component, OnInit, Input, Output, ViewChild, AfterContentInit, OnChanges, AfterViewInit, EventEmitter } from '@angular/core';
import { MatPaginator, MatSort, Sort } from '@angular/material';
import { Contributor } from 'src/app/core/domain/contributor/contributor.model';
import { SortableCollection } from 'src/app/core/sortable.collection';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-sortable-table',
  templateUrl: './sortable-table.component.html'
})
export class SortableTableComponent {

  @Input()
  collection:SortableCollection;

  @Output()
  itemSelected = new EventEmitter();

  constructor() { }

  sortData(sort: Sort) {
    this.collection.sort(sort.active, sort.direction);
  }

  onClicked($event) {
    this.itemSelected.emit($event);
  }
}
