import { calculate, unary, formatValue } from './engine';

test('adds decimal values without floating point artifacts', () => expect(calculate('0.1','0.2','+')).toBe('0.3'));
test('subtracts, multiplies and divides', () => { expect(calculate('9','4','−')).toBe('5'); expect(calculate('9','4','×')).toBe('36'); expect(calculate('9','3','÷')).toBe('3'); });
test('rejects division by zero', () => expect(() => calculate('4','0','÷')).toThrow('Cannot divide by zero'));
test('supports powers', () => expect(calculate('2','8','^')).toBe('256'));
test('supports scientific functions in degrees', () => { expect(unary('9','√')).toBe('3'); expect(unary('5','x²')).toBe('25'); expect(unary('30','sin')).toBe('0.5'); expect(unary('1','log')).toBe('0'); });
test('validates scientific domains', () => { expect(() => unary('-1','√')).toThrow(); expect(() => unary('0','log')).toThrow(); });
test('formats very large and small values', () => { expect(formatValue('10000000000000')).toMatch(/e\+/); expect(formatValue('0.000000001')).toMatch(/e-/); });
