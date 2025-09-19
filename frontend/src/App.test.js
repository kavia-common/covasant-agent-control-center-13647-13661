import { render, screen } from '@testing-library/react';
import App from './App';

test('renders brand in sidebar', () => {
  render(<App />);
  const brand = screen.getByText(/Covasant Control Tower/i);
  expect(brand).toBeInTheDocument();
});
