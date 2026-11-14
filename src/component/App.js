import React, { useCallback, useEffect, useState } from 'react';
import { DEFAULT_STATE, calculate, unary, evaluateExpression, formatValue } from '../logic/engine';
import './App.css';

const KEYS = [
  ['MC','MR','M+','M−','AC'],
  ['sin','cos','tan','log','√'],
  ['x²','xʸ','%','±','÷'],
  ['7','8','9','⌫','×'],
  ['4','5','6','%','−'],
  ['1','2','3','00','+'],
  ['0','.','Ans','=']
];

export default function App() {
  const [state, setState] = useState(DEFAULT_STATE);
  const [theme, setTheme] = useState(() => localStorage.getItem('calculator-theme') || 'dark');
  const [historyOpen, setHistoryOpen] = useState(true);
  const [lastAnswer, setLastAnswer] = useState('0');

  useEffect(() => { document.documentElement.dataset.theme = theme; localStorage.setItem('calculator-theme', theme); }, [theme]);

  const press = useCallback(key => {
    setState(prev => {
      let s = { ...prev, error: null };
      try {
      if (key === 'AC') return { ...DEFAULT_STATE, memory: s.memory, history: s.history };
      if (key === '⌫') return { ...s, display: s.display.length > 1 ? s.display.slice(0, -1) : '0', waiting: false };
      if (key === '00') return { ...s, display: s.waiting || s.display === '0' ? '0' : s.display + '00', waiting: false };
      if (/^\d$/.test(key)) return { ...s, display: s.waiting || s.display === '0' ? key : s.display + key, waiting: false };
      if (key === '.') return { ...s, display: s.waiting ? '0.' : (s.display.includes('.') ? s.display : s.display + '.'), waiting: false };
      if (key === '±') return { ...s, display: formatValue(-Number(s.display)), waiting: false };
      if (key === '%') return { ...s, display: formatValue(Number(s.display) / 100), waiting: false };
      if (key === 'MC') return { ...s, memory: '0' };
      if (key === 'MR') return { ...s, display: s.memory, waiting: true };
      if (key === 'M+') return { ...s, memory: formatValue(Number(s.memory) + Number(s.display)) };
      if (key === 'M−') return { ...s, memory: formatValue(Number(s.memory) - Number(s.display)) };
      if (key === 'Ans') return { ...s, display: lastAnswer, waiting: true };
      if (['√','x²','sin','cos','tan','log'].includes(key)) {
        const result = unary(s.display, key);
        const expression = `${key}(${s.display})`;
        return { ...s, display: result, waiting: true, expression, history: [{ id: Date.now() + Math.random(), expression, result }, ...s.history].slice(0,50) };
      }
      if (key === 'xʸ') return evaluateExpression(s, '^');
      if (['+','−','×','÷'].includes(key)) return evaluateExpression(s, key);
      if (key === '=') {
        if (!s.operator || s.stored === null) return s;
        const expression = `${s.stored} ${s.operator} ${s.display}`;
        const result = calculate(s.stored, s.display, s.operator);
        setLastAnswer(result);
        return { ...s, display: result, stored: null, operator: null, waiting: true, expression, history: [{ id: Date.now() + Math.random(), expression, result }, ...s.history].slice(0,50) };
      }
      return s;
      } catch (err) { return { ...s, error: err.message }; }
    });
  }, [lastAnswer]);

  useEffect(() => {
    const onKey = e => {
      if (/^\d$/.test(e.key)) press(e.key);
      else if (e.key === '.') press('.');
      else if (e.key === '+') press('+');
      else if (e.key === '-') press('−');
      else if (e.key === '*') press('×');
      else if (e.key === '/') { e.preventDefault(); press('÷'); }
      else if (e.key === 'Enter' || e.key === '=') { e.preventDefault(); press('='); }
      else if (e.key === 'Backspace') press('⌫');
      else if (e.key === 'Escape') press('AC');
      else if (e.key === '%') press('%');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [press]);

  const safePress = key => {
    try { press(key); } catch (err) { setState(s => ({ ...s, error: err.message })); }
  };
  const chooseHistory = item => setState(s => ({ ...s, display: item.result, stored: null, operator: null, waiting: true, expression: item.expression, error: null }));

  return <main className="app-shell"><section className="calculator" aria-label="Scientific calculator">
    <header className="topbar"><div><span className="eyebrow">PRECISION TOOL</span><h1>Calculator<span className="accent">.</span></h1></div><div className="top-actions"><button className="icon-button" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}>{theme === 'dark' ? '☀' : '☾'}</button><button className="icon-button history-toggle" onClick={() => setHistoryOpen(!historyOpen)} aria-expanded={historyOpen} aria-label="Toggle history">◷</button></div></header>
    <div className="display" aria-live="polite" aria-atomic="true"><div className="expression">{state.expression || (state.operator ? `${state.stored} ${state.operator}` : ' ' )}</div><div className="display-value" title={state.display}>{state.display}</div><div className="memory-indicator">{state.memory !== '0' ? `M  ${state.memory}` : 'DEG · 12 DIGIT PRECISION'}</div>{state.error && <div className="error-message" role="alert">{state.error}</div>}</div>
    <div className="keypad">{KEYS.flat().map(key => <button key={key} onClick={() => safePress(key)} className={`key ${['÷','×','−','+','='].includes(key) ? 'operator' : ''} ${['AC','⌫'].includes(key) ? 'utility' : ''} ${key === '=' ? 'equals' : ''} ${['sin','cos','tan','log','√','x²','xʸ','MC','MR','M+','M−','Ans'].includes(key) ? 'scientific' : ''} ${key === '0' ? 'zero' : ''}`} aria-label={key === '⌫' ? 'Backspace' : key}>{key}</button>)}</div>
    <footer className="footer"><span>Keyboard ready</span><span>ESC clear&nbsp; · &nbsp;↵ calculate</span></footer>
  </section>
  {historyOpen && <aside className="history-panel"><div className="history-header"><div><span className="eyebrow">YOUR WORKSPACE</span><h2>History</h2></div><button className="text-button" onClick={() => setState(s => ({ ...s, history: [] }))}>Clear all</button></div>{state.history.length ? <div className="history-list">{state.history.map(item => <button className="history-item" key={item.id} onClick={() => chooseHistory(item)}><span>{item.expression}</span><strong>= {item.result}</strong></button>)}</div> : <div className="empty-history"><span>∑</span><p>No calculations yet</p><small>Your recent results will appear here.</small></div>}</aside>}
  </main>;
}
