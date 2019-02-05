import { TestBed, async, inject } from '@angular/core/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ContributorService } from './contributor.service';
import { Contributor } from './contributor.model';

xdescribe('ContributorService', () => {
  let service: ContributorService;
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          HttpClientModule,
        //   HttpClientTestingModule
        ]
      });
      service = TestBed.get(ContributorService);
    });
    
      it('should be created', () => {
        expect(service).toBeTruthy();
      });

      it('should get contributor', () => {
         service.getOne('username').subscribe(contributor => {
            // console.log(contributor.followers, contributor.repoCount);
         });
      });

      // it('should get contributor repos', () => {
      //   service.getContributorRepos('username')).subscribe(repositories => {
      //     // expect(repositories.length).toBeGreaterThan(0);
      //   });
      // });
});