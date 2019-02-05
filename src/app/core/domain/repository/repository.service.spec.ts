import { TestBed, async, inject } from '@angular/core/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Contributor } from '../contributor/contributor.model';
import { RepositoryService } from './repository.service';
import { Repository } from './repository.model';

xdescribe('RepositoryService', () => {
    beforeEach(() => TestBed.configureTestingModule({
        imports: [
          HttpClientTestingModule
        ]
      }));
    
      it('should be created', () => {
        const service: RepositoryService = TestBed.get(RepositoryService);
        expect(service).toBeTruthy();
      });
});