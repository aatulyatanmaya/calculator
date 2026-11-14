import Big from 'big.js';

export const DEFAULT_STATE = { display: '0', stored: null, operator: null, waiting: false, expression: '', error: null, memory: '0', history: [] };

export function formatValue(value) {
  if (!Number.isFinite(Number(value))) throw new Error('Invalid number');
  const n = Number(value);
  if (Math.abs(n) >= 1e12 || (n !== 0 && Math.abs(n) < 1e-8)) return n.toExponential(6).replace(/\.?(0+)e/, 'e');
  return String(Number(n.toPrecision(12)));
}

export function calculate(a, b, op) {
  const x = new Big(a || '0');
  const y = new Big(b || '0');
  let result;
  switch (op) {
    case '+': result = x.plus(y); break;
    case '−': case '-': result = x.minus(y); break;
    case '×': case '*': result = x.times(y); break;
    case '÷': case '/': if (y.eq(0)) throw new Error('Cannot divide by zero'); result = x.div(y); break;
    case '^': result = new Big(Math.pow(Number(x), Number(y)).toString()); break;
    default: throw new Error('Unsupported operation');
  }
  return formatValue(result.toString());
}

export function unary(value, fn) {
  const n = Number(value);
  let result;
  switch (fn) {
    case '√': if (n < 0) throw new Error('Square root requires a non-negative number'); result = Math.sqrt(n); break;
    case 'x²': result = n * n; break;
    case 'sin': result = Math.sin(n * Math.PI / 180); break;
    case 'cos': result = Math.cos(n * Math.PI / 180); break;
    case 'tan': if (Math.abs(Math.cos(n * Math.PI / 180)) < 1e-12) throw new Error('Tangent is undefined at this angle'); result = Math.tan(n * Math.PI / 180); break;
    case 'log': if (n <= 0) throw new Error('Logarithm requires a positive number'); result = Math.log10(n); break;
    default: throw new Error('Unsupported function');
  }
  if (!Number.isFinite(result)) throw new Error('Result is outside the supported range');
  return formatValue(result);
}

export function evaluateExpression(state, nextOperator) {
  if (!state.operator || state.stored === null) return { ...state, stored: state.display, operator: nextOperator, waiting: true, expression: `${state.display} ${nextOperator}` };
  const result = calculate(state.stored, state.display, state.operator);
  return { ...state, display: result, stored: result, operator: nextOperator, waiting: true, expression: `${result} ${nextOperator}` };
}
