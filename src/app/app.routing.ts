import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrganizationDetailComponent } from './pages/organization-detail/organization-detail.component';
import { RepositoryDetailComponent } from './pages/repository-detail/repository-detail.component';
import { ContributorDetailComponent } from './pages/contributor-detail/contributor-detail.component';
import { RepositoryDetailResolverService } from './pages/repository-detail/repository-detail.resolver';
import { ContributorDetailResolverService } from './pages/contributor-detail/contributor-detail.resolver';
import { OrganizationContributorsComponent } from './pages/organization-contributors/organization-contributors.component';
import { OrganizationReposComponent } from './pages/organization-repos/organization-repos.component';

const routes: Routes = [
  {
    path: '',
    component: OrganizationDetailComponent
  },
  {
    path: 'contributors',
    component: OrganizationContributorsComponent
  },
  {
    path: 'contributor',
    component: ContributorDetailComponent,
    resolve: {
      contributor: ContributorDetailResolverService
    }
  },
  {
    path: 'repos',
    component: OrganizationReposComponent
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
