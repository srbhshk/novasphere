// SPDX-License-Identifier: MIT
// @novasphere/ui-agent — SuggestionChips tests

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import SuggestionChips from "./SuggestionChips";

const chips = [
  { id: "1", label: "Reorder dashboard", action: "layout" },
  { id: "2", label: "Explain metrics", action: "explain" },
];

describe("SuggestionChips", () => {
  it("renders nothing when chips is empty", () => {
    const { container } = render(
      <SuggestionChips chips={[]} onSelect={vi.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders chip labels", () => {
    render(<SuggestionChips chips={chips} onSelect={vi.fn()} />);
    expect(screen.getByRole("button", { name: "Reorder dashboard" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Explain metrics" })).toBeInTheDocument();
  });

  it("calls onSelect with chip when clicked", async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    render(<SuggestionChips chips={chips} onSelect={onSelect} />);
    await user.click(screen.getByRole("button", { name: "Explain metrics" }));
    expect(onSelect).toHaveBeenCalledWith(chips[1]);
  });
});
