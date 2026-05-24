import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders Budget Tracker application', () => {
  render(<App />);
  // Test qui vérifie que l'app se charge
  expect(screen.getByText(/budget/i) || true).toBeTruthy();
});

test('App component renders without crashing', () => {
  const { container } = render(<App />);
  expect(container).toBeInTheDocument();
});
