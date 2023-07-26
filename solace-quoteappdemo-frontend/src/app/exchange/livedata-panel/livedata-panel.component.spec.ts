import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LivedataPanelComponent } from './livedata-panel.component';

describe('LivedataPanelComponent', () => {
  let component: LivedataPanelComponent;
  let fixture: ComponentFixture<LivedataPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LivedataPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LivedataPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
