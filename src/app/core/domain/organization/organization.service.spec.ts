import { TestBed, async, inject } from '@angular/core/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Organization } from './organization.model';
import { OrganizationService } from './organization.service';
import { Contributor } from '../contributor/contributor.model';

describe('OrganizationService', () => {
  let service: OrganizationService;
  let clientMock: HttpTestingController;
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          HttpClientTestingModule
        ]
      })
      service = TestBed.get(OrganizationService);
      clientMock = TestBed.get(HttpClientTestingModule);
    });
    
      it('should be created', () => {
        expect(service).toBeTruthy();
      });

      // it('should get contributors', () => {
      //   // const dummyUsers: Contributor[] = [
      //   //   new Contributor(0, 'John'),
      //   //   new Contributor(1, 'Doe')
      //   // ];
  
      //   service.getOrganizationContributors(new Organization('org')).subscribe(users => {
      //     // expect(users.length).toBe(2);
      //     // expect(users).toEqual(dummyUsers);
      //   });
  
      //   const req = clientMock.expectOne(`https://api.github.com/orgs/org/repos?per_page=100`);
      //   // expect(req.request.method).toBe('GET');
      //   // req.flush(dummyUsers);
      //   //  const service: OrganizationService = TestBed.get(OrganizationService);
      //   //  service.getOrganizationContributors(new Organization('angular')).subscribe(organization => {
      //   //      console.log(organization.contributors.size);
      //   //  });
      // });
});