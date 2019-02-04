import { Component, Input, Output, OnInit } from '@angular/core';
import { Organization } from 'src/app/core/domain/organization/organization.model';
import { StateService } from 'src/app/core/state/state.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: []
})
export class AppHeaderComponent implements OnInit {
  
  organization$: Observable<Organization>;

  constructor(private state: StateService) {}

  ngOnInit() {
    this.organization$ = this.state.selectedOrganization$;
  }

  search(itemName) {
    this.state.selectOrganization(itemName);
  }
}
