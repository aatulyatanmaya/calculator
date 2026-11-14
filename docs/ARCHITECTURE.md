# Architecture

## Overview

The application is a React single-page application. `src/component/App.js` owns interaction state and renders the calculator and history panel. Calculation rules are isolated in `src/logic/engine.js` to keep arithmetic independently testable.

## State model

Calculator state includes the display value, pending operand and operator, input mode, memory value, expression label, error message, and recent history entries. Theme preference is stored separately in local storage.

## Calculation flow

1. A keypad click or keyboard event is normalized to a calculator command.
2. `App.js` updates calculator state.
3. Binary and unary calculations are delegated to `engine.js`.
4. Invalid operations are caught and exposed in an accessible alert region.
5. Completed calculations are added to in-session history.

## Precision

`big.js` handles basic binary arithmetic. Scientific functions use JavaScript `Math` and are rounded for display to 12 significant digits. This is suitable for a general-purpose calculator UI, not financial, scientific, or safety-critical computation requiring arbitrary precision throughout.

## Persistence

Only the selected theme is persisted in local storage. Calculation history and calculator memory are session state and reset on page reload.
