import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Button, { ButtonProps } from "../Button";

describe("Button Component", () => {
  const renderButton = (props: Partial<ButtonProps> = {}) => {
    return render(<Button {...props}>Click Me</Button>);
  };

  it("renders with default styles", () => {
    renderButton();
    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("bg-primaryAccent");
    expect(button).toHaveClass("text-white");
  });

  it('applies "destructive" variant styles', () => {
    renderButton({ variant: "destructive" });
    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toHaveClass("bg-destructive");
    expect(button).toHaveClass("text-destructive-foreground");
  });

  it('applies "outline" variant styles', () => {
    renderButton({ variant: "outline" });
    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toHaveClass("border");
    expect(button).toHaveClass("hover:bg-accent");
  });

  it("applies different sizes", () => {
    const { rerender } = renderButton({ size: "sm" }); // Render the first button
    const smallButton = screen.getByRole("button", { name: /click me/i });
    expect(smallButton).toHaveClass("h-9");

    rerender(<Button size="lg">Click Me</Button>); // Re-render with a different size
    const largeButton = screen.getByRole("button", { name: /click me/i });
    expect(largeButton).toHaveClass("h-11");
  });

  it("handles click events", () => {
    const onClick = vi.fn();
    renderButton({ onClick });
    const button = screen.getByRole("button", { name: /click me/i });
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders as child component when "asChild" is true', () => {
    const { container } = render(
      <Button asChild>
        <a href="#">Click Me</a>
      </Button>
    );
    const anchor = container.querySelector("a");
    expect(anchor).toBeInTheDocument();
    expect(anchor).toHaveTextContent("Click Me");
  });

  it("applies additional classNames", () => {
    renderButton({ className: "custom-class" });
    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toHaveClass("custom-class");
  });

  it("disables button when disabled prop is true", () => {
    renderButton({ disabled: true });
    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeDisabled();
  });
});
