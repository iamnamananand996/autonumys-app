import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Progress from "../Progress";

describe("Progress Component", () => {
  it("renders with default styles", () => {
    render(<Progress value={50} />);
    const progressRoot = screen.getByRole("progressbar");
    expect(progressRoot).toBeInTheDocument();
    expect(progressRoot).toHaveClass(
      "relative h-4 w-full overflow-hidden rounded-full bg-secondary"
    );
  });

  it("renders with correct progress indicator width", () => {
    render(<Progress value={75} />);
    const progressIndicator = screen.getByRole("progressbar").firstChild;
    expect(progressIndicator).toBeInTheDocument();
    expect(progressIndicator).toHaveStyle({ transform: "translateX(-25%)" }); // 100 - value (75)
  });

  it("applies custom className to root", () => {
    render(<Progress className="custom-class" value={30} />);
    const progressRoot = screen.getByRole("progressbar");
    expect(progressRoot).toHaveClass("custom-class");
  });

  it("forwards additional props", () => {
    render(<Progress data-testid="progress-test" value={50} />);
    const progressRoot = screen.getByTestId("progress-test");
    expect(progressRoot).toBeInTheDocument();
  });

  it("handles empty or null value gracefully", () => {
    render(<Progress />);
    const progressIndicator = screen.getByRole("progressbar").firstChild;
    expect(progressIndicator).toHaveStyle({ transform: "translateX(-100%)" }); // Default to 0 progress
  });
});
