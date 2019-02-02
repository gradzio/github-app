import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
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

@NgModule({
  declarations: [
    AppComponent,
    OrganizationDetailComponent,
    ContributorDetailComponent,
    RepositoryDetailComponent
  ],
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
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
