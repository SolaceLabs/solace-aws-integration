import { TestBed } from '@angular/core/testing';

import { MsgRateCalculatorService } from './msg-rate-calculator.service';

describe('MsgRateCalculatorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MsgRateCalculatorService = TestBed.get(MsgRateCalculatorService);
    expect(service).toBeTruthy();
  });
});
