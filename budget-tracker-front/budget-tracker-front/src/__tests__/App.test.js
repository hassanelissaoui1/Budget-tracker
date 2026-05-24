import { render } from '@testing-library/react';
import App from '../App';

test('App renders without crashing', () => {
  render(<App />);
  expect(true).toBe(true);
});

test('App component exists and renders', () => {
  const { container } = render(<App />);
  expect(container).toBeDefined();
  expect(container).not.toBeNull();
});
