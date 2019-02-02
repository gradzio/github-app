import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationDetailComponent } from './organization-detail.component';
import { OrganizationService } from '../../core/domain/organization/organization.service';
import { OrganizationServiceStub } from '../../core/domain/organization/organization.service.stub';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('OrganizationComponent', () => {
  let component: OrganizationDetailComponent;
  let fixture: ComponentFixture<OrganizationDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [ OrganizationDetailComponent ],
      providers: [
        {provide: OrganizationService, useClass: OrganizationServiceStub}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get contributors', () => {
    // component.contributors$.subscribe(contributors => {
    //   expect(contributors.items.length).toBe(2);
    // });
  });
});
