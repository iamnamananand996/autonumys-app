import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Badge from "../Badge";

describe("Badge Component", () => {
  it("renders with default styles", () => {
    render(<Badge>Default Badge</Badge>);
    const badge = screen.getByText("Default Badge");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass(
      "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
    );
    expect(badge).toHaveClass(
      "border-transparent bg-primaryAccent text-white hover:bg-primary/80"
    );
  });

  it("applies secondary variant styles", () => {
    render(<Badge variant="secondary">Secondary Badge</Badge>);
    const badge = screen.getByText("Secondary Badge");
    expect(badge).toHaveClass(
      "border-transparent bg-grayDark text-white hover:bg-secondary/80"
    );
  });

  it("applies destructive variant styles", () => {
    render(<Badge variant="destructive">Destructive Badge</Badge>);
    const badge = screen.getByText("Destructive Badge");
    expect(badge).toHaveClass(
      "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80"
    );
  });

  it("applies success variant styles", () => {
    render(<Badge variant="success">Success Badge</Badge>);
    const badge = screen.getByText("Success Badge");
    expect(badge).toHaveClass(
      "border-transparent bg-green-500 text-white hover:bg-green-500/80"
    );
  });

  it("renders with custom className", () => {
    render(<Badge className="custom-class">Custom Badge</Badge>);
    const badge = screen.getByText("Custom Badge");
    expect(badge).toHaveClass("custom-class");
  });

  it("passes additional props to the component", () => {
    render(<Badge data-testid="badge-test">Test Badge</Badge>);
    const badge = screen.getByTestId("badge-test");
    expect(badge).toBeInTheDocument();
  });
});
