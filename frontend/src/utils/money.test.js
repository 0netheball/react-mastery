import { it, expect, describe } from 'vitest';
import { formatCurrency } from './money';

describe('test suite: formatCurrency', () => {
  it('formats 15000 as 15 000 ₽', () => {
    expect(formatCurrency(15000)).toBe('15 000 ₽');
  });

  it('formats small numbers', () => {
    expect(formatCurrency(8000)).toBe('8 000 ₽');
    expect(formatCurrency(500)).toBe('500 ₽');
  });
});
