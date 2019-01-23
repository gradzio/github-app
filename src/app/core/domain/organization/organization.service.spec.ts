import { TestBed, async, inject } from '@angular/core/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Organization } from './organization.model';
import { OrganizationService } from './organization.service';

xdescribe('OrganizationService', () => {
    beforeEach(() => TestBed.configureTestingModule({
        imports: [
          HttpClientModule,
        //   HttpClientTestingModule
        ]
      }));
    
      it('should be created', () => {
        const service: OrganizationService = TestBed.get(OrganizationService);
        expect(service).toBeTruthy();
      });

      it('should get contributors', () => {
         const service: OrganizationService = TestBed.get(OrganizationService);
         service.getOrganizationContributors(new Organization('angular')).subscribe(organization => {
             console.log(organization.contributors.size);
         });
      });
});