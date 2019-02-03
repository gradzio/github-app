import { Component, OnInit, Input, Output, ViewChild, AfterContentInit, OnChanges, AfterViewInit, EventEmitter, SimpleChanges } from '@angular/core';
import { Sort, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { SortableCollection } from 'src/app/shared/presentation-components/simple-list/sortable.collection';
import { Contributor } from 'src/app/core/domain/contributor/contributor.model';
import { map, filter } from 'rxjs/operators';
import { StateService } from 'src/app/core/state/state.service';
import { Organization } from 'src/app/core/domain/organization/organization.model';

@Component({
  selector: 'app-sortable-table',
  templateUrl: './sortable-table.component.html'
})
export class SortableTableComponent implements OnInit {
  displayedColumns: string[] = ['position', 'avatar', 'username', 'contributions', 'followers', 'repos', 'gists', 'action'];
  dataSource = new MatTableDataSource([]);
  pagePosition: number = 1;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @Output()
  itemSelected = new EventEmitter();

  constructor(protected state: StateService) { }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.paginator.page.pipe(
      map(() => {
          this.pagePosition = this.paginator.pageIndex * this.paginator.pageSize + 1;
      })
    ).subscribe();

    this.loadData();
  }

  loadData() {

  }
  onClicked($event) {
    this.itemSelected.emit($event);
  }
}
