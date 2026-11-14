# Calculator — Scientific Edition

A responsive calculator application based on the original React calculator project. This edition adds a scientific keypad, keyboard input, calculation history, memory operations, light/dark themes, accessible controls, safer arithmetic, and automated tests.

## Features

- Basic arithmetic: addition, subtraction, multiplication, division, percentage and sign toggle.
- Scientific operations: square root, square, power, sine, cosine, tangent and base-10 logarithm. Trigonometric inputs are in degrees.
- Memory: MC (clear), MR (recall), M+ (add displayed value), M− (subtract displayed value).
- Calculation history: select a previous result to reuse it; clear the history at any time.
- Keyboard: digits, `.`, `+`, `-`, `*`, `/`, `%`, `Enter`/`=`, `Backspace`, and `Escape`.
- Theme preference is saved in browser local storage.
- Responsive layout, visible focus states, accessible button labels and live result announcements.
- Big.js arithmetic for decimal-safe basic operations, domain checks and readable large/small number formatting.

## Requirements

- Node.js 14 or newer (Node 16 LTS recommended for this legacy Create React App 3 toolchain).
- npm 6 or newer.

## Installation

```bash
npm install
npm start
```

The development server opens at `http://localhost:3000`.

## Tests and production build

```bash
npm test -- --watchAll=false
npm run build
```

Tests cover arithmetic precision, division by zero, powers, scientific-function domains, number formatting, UI arithmetic and history reuse.

## Keyboard reference

| Key | Action |
|---|---|
| `0`–`9` | Enter digit |
| `00` button | Enter two zeroes |
| `.` | Decimal point |
| `+`, `-`, `*`, `/` | Arithmetic operator |
| `Enter` or `=` | Evaluate |
| `Backspace` | Delete last digit |
| `Escape` | Clear calculator |
| `%` | Convert displayed value to a percentage |

## Project structure

```text
src/
  component/
    App.js          Main calculator, keyboard handling, history and themes
    App.css         Responsive application styling
    App.test.js     UI integration tests
  logic/
    engine.js       Arithmetic and scientific calculation functions
    engine.test.js  Calculation unit tests
  index.js          React entry point
  index.css         Global reset and typography
public/             Static application assets
```

## Calculation behavior and limitations

- Basic arithmetic uses `big.js` to avoid common binary floating-point errors (for example, `0.1 + 0.2`).
- Scientific functions use JavaScript's `Math` implementation and are therefore subject to IEEE-754 floating-point precision.
- Trigonometric functions accept degrees.
- Division by zero, square roots of negative values, logarithms of non-positive values, and tangent singularities are reported as visible errors.
- Display formatting uses up to 12 significant digits; sufficiently large or small results use scientific notation.
- History is held in application memory and is cleared when the page is reloaded. Theme preference persists in local storage.
- The power function uses JavaScript `Math.pow`; results outside the supported numeric range are rejected by formatting validation.

## Developer notes

The original project uses React 16 and Create React App 3. The application entry point and original MIT license are retained. `src/logic/engine.js` is deliberately UI-independent so arithmetic can be tested separately. Keep calculation rules in this module and keep browser interaction in `App.js`.

When contributing:
1. Create a focused feature or fix branch.
2. Add or update tests for changed behavior.
3. Run the test suite and production build.
4. Document user-visible behavior and limitations.
5. Submit a pull request with a concise description and reproduction steps for bug fixes.

## License

MIT. See [LICENSE](LICENSE). Original project attribution and license are retained.
