import { Component, OnInit } from '@angular/core';
import { RepositoryService } from '../core/domain/repository/repository.service';
import { Observable } from 'rxjs';
import { Repository } from '../core/domain/repository/repository.model';

@Component({
  selector: 'app-repository-detail',
  templateUrl: './repository-detail.component.html'
})
export class RepositoryDetailComponent implements OnInit {
  repository$: Observable<Repository>;
  constructor(private service: RepositoryService) { }

  ngOnInit() {
    this.repository$ = this.service.getRepoContributors(new Repository('angular/angular'));
  }

}
