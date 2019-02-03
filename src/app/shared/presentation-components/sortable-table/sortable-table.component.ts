import { Component, OnInit, Input, Output, ViewChild, AfterContentInit, OnChanges, AfterViewInit, EventEmitter, SimpleChanges } from '@angular/core';
import { Sort, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { SortableCollection } from 'src/app/shared/presentation-components/simple-list/sortable.collection';
import { Contributor } from 'src/app/core/domain/contributor/contributor.model';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-sortable-table',
  templateUrl: './sortable-table.component.html'
})
export class SortableTableComponent implements OnInit, OnChanges {
  displayedColumns: string[] = ['position', 'avatar', 'username', 'contributions', 'repos', 'gists', 'action'];
  dataSource = new MatTableDataSource([]);
  pagePosition: number = 1;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  // TODO: Create VM for that
  @Input()
  tableData: Contributor[];

  @Output()
  itemSelected = new EventEmitter();

  constructor() { }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.paginator.page.pipe(
      map(() => {
          this.pagePosition = this.paginator.pageIndex * this.paginator.pageSize + 1;
      })
    ).subscribe();
  }

  sortData($event) {
    console.log($event);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.tableData.previousValue !== changes.tableData.currentValue) {
      this.dataSource.data = changes.tableData.currentValue;
    }
  }

  onClicked($event) {
    this.itemSelected.emit($event);
  }
}
