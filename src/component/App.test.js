import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-dom/test-utils';
import App from './App';

describe('Calculator interface', () => {
  let container;
  beforeEach(() => { container = document.createElement('div'); document.body.appendChild(container); });
  afterEach(() => { ReactDOM.unmountComponentAtNode(container); document.body.removeChild(container); });
  const click = label => {
    const button = Array.from(container.querySelectorAll('button')).find(node => node.textContent === label);
    TestUtils.Simulate.click(button);
  };
  test('renders and performs addition', () => {
    TestUtils.act(() => ReactDOM.render(<App />, container));
    TestUtils.act(() => { click('2'); click('+'); click('3'); click('='); });
    expect(container.querySelector('.display-value').textContent).toBe('5');
  });
  test('records calculations and allows result reuse', () => {
    TestUtils.act(() => ReactDOM.render(<App />, container));
    TestUtils.act(() => { click('7'); click('×'); click('6'); click('='); });
    expect(container.textContent).toContain('= 42');
    TestUtils.act(() => click('= 42'));
    expect(container.querySelector('.display-value').textContent).toBe('42');
  });
});
