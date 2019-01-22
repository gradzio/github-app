import { TestBed, async, inject } from '@angular/core/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ContributorService } from './contributor.service';
import { Contributor } from './contributor.model';

describe('ContributorService', () => {
    beforeEach(() => TestBed.configureTestingModule({
        imports: [
          HttpClientModule,
        //   HttpClientTestingModule
        ]
      }));
    
      it('should be created', () => {
        const service: ContributorService = TestBed.get(ContributorService);
        expect(service).toBeTruthy();
      });

      it('should get contributor', () => {
         // TODO: contributions ??
         const service: ContributorService = TestBed.get(ContributorService);
         service.getOne(new Contributor(1, 'bradlygreen')).subscribe(contributor => {
            console.log(contributor.followers, contributor.repoCount);
         });
      });
});