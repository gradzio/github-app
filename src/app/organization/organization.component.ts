import { Component, OnInit } from '@angular/core';
import { RepositoryService } from '../core/domain/repository/repository.service';
import { Repository } from '../core/domain/repository/repository.model';
import { Observable } from 'rxjs';
import { LinkHeaderParser, Parser } from '../core/pagination/link-header.parser';
import { HttpHeaders } from '@angular/common/http';
import { Contributor } from '../core/domain/contributor/contributor.model';
import { OrganizationService } from '../core/domain/organization/organization.service';
import { Organization } from '../core/domain/organization/organization.model';

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html'
})
export class OrganizationComponent implements OnInit {

  // repository = new Repository('bradlygreen/angular');
  organization = new Organization('angular');
  organization$: Observable<Organization>;

  constructor(private service: OrganizationService) {}

  ngOnInit() {
    // this.service.getRepoContributors(this.repository).subscribe(resp => {
    //   console.log(resp);
    // });
    this.organization$ = this.service.getOrganizationContributors(this.organization);
  }

}
