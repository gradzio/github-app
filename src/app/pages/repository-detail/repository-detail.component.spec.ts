import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepositoryDetailComponent } from './repository-detail.component';
import { RepositoryService } from 'src/app/core/domain/repository/repository.service';
import { RepositoryServiceStub } from 'src/app/core/domain/repository/repository.service.stub';

describe('RepositoryDetailComponent', () => {
  let component: RepositoryDetailComponent;
  let fixture: ComponentFixture<RepositoryDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepositoryDetailComponent ],
      providers: [
        {provide: RepositoryService, useClass: RepositoryServiceStub}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepositoryDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
