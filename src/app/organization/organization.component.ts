import { Component, OnInit } from '@angular/core';
import { RepositoryService } from '../core/domain/repository.service';
import { Repository } from '../core/domain/repository.model';
import { MemoryStorage } from '../core/ cache/memory.store';
import { Organization } from '../core/domain/organization.model';
import { Observable } from 'rxjs';
import { Contributor } from '../core/domain/contributor.model';

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.scss']
})
export class OrganizationComponent implements OnInit {

  repository = new Repository('angular/angular');
  contributors$: Observable<Contributor[]>;

  constructor(private service: RepositoryService) {}

  ngOnInit() {
    this.contributors$ = this.service.getRepoContributors(this.repository);
  }

}
