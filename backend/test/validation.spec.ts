import { isValidPrice } from '../src/common/validation';

describe('isValidPrice', () => {
  it('rejects undefined, null, and non-numeric', () => {
    expect(isValidPrice(undefined as any)).toBe(false);
    expect(isValidPrice(null as any)).toBe(false);
    expect(isValidPrice('abc' as any)).toBe(false);
  });

  it('rejects negative and zero and below minimum', () => {
    expect(isValidPrice(-1)).toBe(false);
    expect(isValidPrice(0)).toBe(false);
    expect(isValidPrice(0.001)).toBe(false);
  });

  it('accepts minimum boundary 0.01 and above', () => {
    expect(isValidPrice(0.01)).toBe(true);
    expect(isValidPrice('0.01')).toBe(true);
    expect(isValidPrice(10)).toBe(true);
  });
});

