import { TestBed } from '@angular/core/testing';

import { ListStockSymbolsService } from './list-stock-symbols.service';

describe('ListStockSymbolsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ListStockSymbolsService = TestBed.get(ListStockSymbolsService);
    expect(service).toBeTruthy();
  });
});
