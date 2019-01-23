import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MemoryStorage } from './core/ cache/memory.store';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { CacheInterceptor } from './core/ cache/cache.interceptor';
import { OrganizationComponent } from './organization/organization.component';
import { RouterModule } from '@angular/router';
import { LinkHeaderParser } from './core/pagination/link-header.parser';
import { RepositoryDetailComponent } from './repository-detail/repository-detail.component';
import { ContributorDetailComponent } from './contributor-detail/contributor-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    OrganizationComponent,
    ContributorDetailComponent,
    RepositoryDetailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    RouterModule
  ],
  providers: [
    MemoryStorage,
    LinkHeaderParser,
    { provide: HTTP_INTERCEPTORS, useClass: CacheInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
