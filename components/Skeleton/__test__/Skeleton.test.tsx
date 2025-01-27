import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Skeleton from "../Skeleton";

describe("Skeleton Component", () => {
  it("renders with default styles", () => {
    render(<Skeleton data-testid="skeleton" />);
    const skeleton = screen.getByTestId("skeleton");
    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveClass("animate-pulse rounded-md bg-slate-500");
  });

  it("applies custom className", () => {
    render(<Skeleton className="custom-class" data-testid="skeleton" />);
    const skeleton = screen.getByTestId("skeleton");
    expect(skeleton).toHaveClass("custom-class");
    expect(skeleton).toHaveClass("animate-pulse rounded-md bg-slate-500");
  });

  it("passes additional props", () => {
    render(<Skeleton data-testid="skeleton" />);
    const skeleton = screen.getByTestId("skeleton");
    expect(skeleton).toBeInTheDocument();
  });

  it("renders children if passed", () => {
    render(<Skeleton>Loading...</Skeleton>);
    const skeleton = screen.getByText("Loading...");
    expect(skeleton).toBeInTheDocument();
  });
});
