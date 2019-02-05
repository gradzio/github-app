import { Component, OnInit } from '@angular/core';
import { RepositoryService } from './core/domain/repository/repository.service';
import { Repository } from './core/domain/repository/repository.model';
import { Organization } from './core/domain/organization/organization.model';
import { StateService } from './core/state/state.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  title = 'github-app';

  constructor(private state: StateService) {}

  ngOnInit() {
    this.state.selectOrganization('Angular');
  }
}
