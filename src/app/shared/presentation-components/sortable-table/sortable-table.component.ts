import { Component, OnInit, Input, Output, ViewChild, AfterContentInit, OnChanges, AfterViewInit, EventEmitter } from '@angular/core';
import { Sort } from '@angular/material';
import { SortableCollection } from 'src/app/shared/presentation-components/sortable-table/sortable.collection';

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
    this.collection.sort = sort;
  }

  onClicked($event) {
    this.itemSelected.emit($event);
  }
}
