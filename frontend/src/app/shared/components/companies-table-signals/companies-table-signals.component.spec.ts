import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompaniesTableSignalsComponent } from './companies-table-signals.component';

describe('CompaniesTableSignalsComponent', () => {
  let component: CompaniesTableSignalsComponent;
  let fixture: ComponentFixture<CompaniesTableSignalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompaniesTableSignalsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompaniesTableSignalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
