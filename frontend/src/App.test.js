import { screen } from "@testing-library/react";
import App from "./App";
import { renderWithAppProvider } from "./testing/test-utils";

test("renders brand in sidebar", async () => {
  renderWithAppProvider(<App />);
  const brandLink = await screen.findByRole("link", { name: /Covasant Control Tower/i });
  expect(brandLink).toBeInTheDocument();
});
