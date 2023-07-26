import { TestBed } from '@angular/core/testing';

import { LiveStockPriceService } from './live-stock-price.service';

describe('LiveStockPriceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LiveStockPriceService = TestBed.get(LiveStockPriceService);
    expect(service).toBeTruthy();
  });
});
