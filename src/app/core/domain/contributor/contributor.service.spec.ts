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
          HttpClientTestingModule
        ]
      });
      service = TestBed.get(ContributorService);
    });
    
      it('should be created', () => {
        expect(service).toBeTruthy();
      });
});