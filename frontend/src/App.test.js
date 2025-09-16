import { render, screen } from '@testing-library/react';
import App from './App';

test('renders navigation brand', () => {
  render(<App />);
  const brand = screen.getByText(/Covasant Control Tower/i);
  expect(brand).toBeInTheDocument();
});
