import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";
import useMediaQuery from "../useMediaQuery";
import React from "react";

describe("useMediaQuery Hook", () => {
  let originalMatchMedia: typeof window.matchMedia;
  const listeners: Record<string, () => void> = {};

  beforeAll(() => {
    originalMatchMedia = window.matchMedia;
    // Mock matchMedia
    window.matchMedia = vi.fn().mockImplementation((query: string) => {
      return {
        matches: query === "(min-width: 768px)", // Default match condition
        media: query,
        addEventListener: (event: string, listener: () => void) => {
          listeners[event] = listener;
        },
        removeEventListener: (event: string) => {
          delete listeners[event];
        },
        dispatchEvent: (event: Event) => {
          if (event.type in listeners) {
            listeners[event.type]();
          }
        },
      };
    });
  });

  afterAll(() => {
    window.matchMedia = originalMatchMedia; // Restore original implementation
  });

  const TestComponent = ({ query }: { query: string }) => {
    const matches = useMediaQuery(query);
    return <div data-testid="result">{matches ? "Matches" : "No Match"}</div>;
  };

  it("returns the correct initial value for a matching query", () => {
    render(<TestComponent query="(min-width: 768px)" />);
    const result = screen.getByTestId("result");
    expect(result.textContent).toBe("Matches");
  });

  it("returns the correct initial value for a non-matching query", () => {
    render(<TestComponent query="(min-width: 1024px)" />);
    const result = screen.getByTestId("result");
    expect(result.textContent).toBe("No Match");
  });

  it("updates the value when the media query changes", () => {
    const { rerender } = render(<TestComponent query="(min-width: 768px)" />);
    const result = screen.getByTestId("result");
    expect(result.textContent).toBe("Matches");

    // Update the mock to simulate a query that doesn't match
    vi.spyOn(window, "matchMedia").mockImplementation((query) => {
      return {
        matches: query === "(min-width: 1024px)", // Simulate non-matching condition
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      };
    });

    // Rerender with the new query
    rerender(<TestComponent query="(min-width: 1024px)" />);
    expect(result.textContent).toBe("Matches");
  });
});
