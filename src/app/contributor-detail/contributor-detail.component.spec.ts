import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContributorDetailComponent } from './contributor-detail.component';
import { ContributorService } from '../core/domain/contributor/contributor.service';
import { ContributorServiceStub } from '../core/domain/contributor/contributor.service.stub';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ContributorDetailComponent', () => {
  let component: ContributorDetailComponent;
  let fixture: ComponentFixture<ContributorDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ ContributorDetailComponent ],
      providers: [{provide: ContributorService, useClass: ContributorServiceStub}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContributorDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return contributor with repos', () => {
    component.contributor$.subscribe(contributor => expect(contributor.repositories.length).toEqual(3));
  });
});
