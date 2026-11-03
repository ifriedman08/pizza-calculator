import { render, screen, fireEvent } from "@testing-library/react";
import App, { getVerdict } from "./App";

test("renders the calculator", () => {
  render(<App />);
  expect(screen.getByText(/pizza calculator/i)).toBeInTheDocument();
});

test("shows a verdict once inputs are filled", () => {
  render(<App />);
  fireEvent.change(screen.getByLabelText(/number of people/i), {
    target: { value: "10" },
  });
  // 1 × 14" pizza for 10 people ≈ 0.11 sq ft each
  expect(screen.getByText(/not enough/i)).toBeInTheDocument();
});

test("verdict tiers", () => {
  expect(getVerdict(0.2).label).toBe("Not enough");
  expect(getVerdict(0.4).label).toBe("Just right");
  expect(getVerdict(0.6).label).toBe("Generous");
  expect(getVerdict(1.0).label).toBe("Too much");
});
