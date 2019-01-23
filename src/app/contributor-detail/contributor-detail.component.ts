import { Component, OnInit } from '@angular/core';
import { ContributorService } from '../core/domain/contributor/contributor.service';
import { Contributor } from '../core/domain/contributor/contributor.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-contributor-detail',
  templateUrl: './contributor-detail.component.html'
})
export class ContributorDetailComponent implements OnInit {

  contributor$: Observable<Contributor>;
  
  constructor(private service: ContributorService) { }

  ngOnInit() {
    this.contributor$ = this.service.getContributorRepos(new Contributor(1, 'bradlygreen'));
  }

}
