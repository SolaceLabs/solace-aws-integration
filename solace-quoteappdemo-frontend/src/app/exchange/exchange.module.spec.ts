import { ExchangeModule } from './exchange.module';

describe('ExchangeModule', () => {
  let exchangeModule: ExchangeModule;

  beforeEach(() => {
    exchangeModule = new ExchangeModule();
  });

  it('should create an instance', () => {
    expect(exchangeModule).toBeTruthy();
  });
});
