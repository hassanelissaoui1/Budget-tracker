import { render, screen } from '@testing-library/react';
import DashboardPage from '../components/DashboardPage'; // Ajuste le chemin si nécessaire

test('Dashboard renders title', () => {
  render(<DashboardPage />);
  const title = screen.getByText(/My Activity|Dashboard/i);
  expect(title).toBeInTheDocument();
});
