import { Component, OnInit } from '@angular/core';
import { RepositoryService } from './core/domain/repository/repository.service';
import { Repository } from './core/domain/repository/repository.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'github-app';
}
