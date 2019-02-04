// import * as $ from 'jquery';
import { MediaMatcher } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import {
  ChangeDetectorRef,
  Component,
  NgZone,
  OnDestroy,
  ViewChild,
  HostListener,
  Directive,
  AfterViewInit,
  OnInit
} from '@angular/core';
import { StateService } from 'src/app/core/state/state.service';
import { Observable } from 'rxjs';
import { Organization } from 'src/app/core/domain/organization/organization.model';
import { AvatarItem } from 'src/app/shared/github.viewmodel';
import { map, filter } from 'rxjs/operators';

/** @title Responsive sidenav */
@Component({
  selector: 'app-full-layout',
  templateUrl: 'full.component.html',
  styleUrls: []
})
export class FullComponent implements OnInit, OnDestroy, AfterViewInit {
  mobileQuery: MediaQueryList;
  organization$: Observable<AvatarItem>;

  private _mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private state: StateService
  ) {
    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {
   this.organization$ = this.state.selectedOrganization$.pipe(
     filter(organization => organization !== null),
     map((organization: Organization) => {
       return {avatarUrl: organization.avatarUrl, name: organization.name};
     })
   );
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
  ngAfterViewInit() {}
}
