import { render } from '@testing-library/react';
import App from '../App';

test('App renders without crashing', () => {
  render(<App />);
  expect(true).toBe(true);
});

test('App component is defined', () => {
  expect(App).toBeDefined();
});
