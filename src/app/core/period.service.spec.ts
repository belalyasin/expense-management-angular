import { PeriodService } from './period.service';

describe('PeriodService', () => {
  let service: PeriodService;

  beforeEach(() => {
    service = new PeriodService();
  });

  it('starts on the current month', () => {
    const now = new Date();
    expect(service.period).toEqual({ month: now.getMonth() + 1, year: now.getFullYear() });
  });

  it('reads the value of a month input', () => {
    service.setFromInput('2020-03');
    expect(service.period).toEqual({ month: 3, year: 2020 });
    expect(service.inputValue).toBe('2020-03');
  });

  it('ignores an empty or malformed value', () => {
    service.setFromInput('2020-03');
    service.setFromInput('');
    service.setFromInput('2020-13');
    service.setFromInput('March');
    expect(service.period).toEqual({ month: 3, year: 2020 });
  });
});
