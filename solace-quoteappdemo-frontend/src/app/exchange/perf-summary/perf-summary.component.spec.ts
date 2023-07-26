import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfSummaryComponent } from './perf-summary.component';

describe('PerfSummaryComponent', () => {
  let component: PerfSummaryComponent;
  let fixture: ComponentFixture<PerfSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PerfSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PerfSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
