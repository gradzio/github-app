import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app.routing';
import { AppComponent } from './app.component';
import { MemoryStorage } from './core/ cache/memory.store';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { CacheInterceptor } from './core/ cache/cache.interceptor';
import { OrganizationDetailComponent } from './pages/organization-detail/organization-detail.component';
import { LinkHeaderParser } from './core/pagination/link-header.parser';
import { RepositoryDetailComponent } from './pages/repository-detail/repository-detail.component';
import { ContributorDetailComponent } from './pages/contributor-detail/contributor-detail.component';
import { SharedModule } from './shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreService } from './core/state/store.service';
import { FullComponent } from './layouts/full/full.component';
import { AppHeaderComponent } from './layouts/full/header/header.component';
import { AppSidebarComponent } from './layouts/full/sidebar/sidebar.component';
import { SpinnerComponent } from './shared/spinner.component';
import { MaterialModule } from './shared/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { OrganizationContributorsComponent } from './pages/organization-contributors/organization-contributors.component';
import { OrganizationReposComponent } from './pages/organization-repos/organization-repos.component';

@NgModule({
  declarations: [
    FullComponent,
    AppHeaderComponent,
    SpinnerComponent,
    AppSidebarComponent,
    AppComponent,
    OrganizationDetailComponent,
    OrganizationContributorsComponent,
    ContributorDetailComponent,
    OrganizationReposComponent,
    RepositoryDetailComponent
  ],
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    MaterialModule,
    SharedModule
  ],
  providers: [
    MemoryStorage,
    LinkHeaderParser,
    StoreService,
    { provide: HTTP_INTERCEPTORS, useClass: CacheInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
