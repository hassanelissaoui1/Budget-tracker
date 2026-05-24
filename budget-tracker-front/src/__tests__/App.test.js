import { render } from '@testing-library/react';
import App from '../App';

test('renders Budget Tracker app without crashing', () => {
  render(<App />);
  expect(true).toBe(true);
});

test('App component is defined', () => {
  expect(App).toBeDefined();
});
