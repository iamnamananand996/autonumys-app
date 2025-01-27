import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../Card";

describe("Card Component Suite", () => {
  it("renders the Card with default styles", () => {
    render(<Card>Card Content</Card>);
    const card = screen.getByText("Card Content");
    expect(card).toBeInTheDocument();
    expect(card).toHaveClass(
      "rounded-lg border bg-card text-card-foreground shadow-sm"
    );
  });

  it("renders the CardHeader with default styles", () => {
    render(<CardHeader>Card Header</CardHeader>);
    const header = screen.getByText("Card Header");
    expect(header).toBeInTheDocument();
    expect(header).toHaveClass("flex flex-col space-y-1.5 p-6");
  });

  it("renders the CardTitle with default styles", () => {
    render(<CardTitle>Card Title</CardTitle>);
    const title = screen.getByText("Card Title");
    expect(title).toBeInTheDocument();
    expect(title).toHaveClass(
      "text-2xl font-semibold leading-none tracking-tight"
    );
  });

  it("renders the CardContent with default styles", () => {
    render(<CardContent>Card Content</CardContent>);
    const content = screen.getByText("Card Content");
    expect(content).toBeInTheDocument();
    expect(content).toHaveClass("p-6 pt-0");
  });

  it("renders the CardFooter with default styles", () => {
    render(<CardFooter>Card Footer</CardFooter>);
    const footer = screen.getByText("Card Footer");
    expect(footer).toBeInTheDocument();
    expect(footer).toHaveClass("flex items-center p-6 pt-0");
  });

  it("applies custom className to Card", () => {
    render(<Card className="custom-class">Card Content</Card>);
    const card = screen.getByText("Card Content");
    expect(card).toHaveClass("custom-class");
  });

  it("applies custom className to CardHeader", () => {
    render(<CardHeader className="custom-class">Card Header</CardHeader>);
    const header = screen.getByText("Card Header");
    expect(header).toHaveClass("custom-class");
  });

  it("passes additional props to CardTitle", () => {
    render(<CardTitle data-testid="card-title">Card Title</CardTitle>);
    const title = screen.getByTestId("card-title");
    expect(title).toBeInTheDocument();
  });
});
