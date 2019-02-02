import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrganizationDetailComponent } from './pages/organization-detail/organization-detail.component';
import { RepositoryDetailComponent } from './pages/repository-detail/repository-detail.component';
import { ContributorDetailComponent } from './pages/contributor-detail/contributor-detail.component';
import { RepositoryDetailResolverService } from './pages/repository-detail/repository-detail.resolver';
import { ContributorDetailResolverService } from './pages/contributor-detail/contributor-detail.resolver';

const routes: Routes = [
  {
    path: '',
    component: OrganizationDetailComponent
  },
  {
    path: 'contributor',
    component: ContributorDetailComponent,
    resolve: {
      contributor: ContributorDetailResolverService
    }
  },
  {
    path: 'repo',
    component: RepositoryDetailComponent,
    resolve: {
      repository: RepositoryDetailResolverService
    }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
