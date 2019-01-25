import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { OrganizationComponent } from './organization/organization.component';
import { RepositoryDetailComponent } from './repository-detail/repository-detail.component';
import { ContributorDetailComponent } from './contributor-detail/contributor-detail.component';

const routes: Routes = [
  {
    path: '',
    component: OrganizationComponent
  },
  {
    path: 'contributor',
    component: ContributorDetailComponent
  },
  {
    path: 'repo',
    component: RepositoryDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
