// SPDX-License-Identifier: MIT
// @novasphere/ui-agent — AdapterStatusBadge tests

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import AdapterStatusBadge from "./AdapterStatusBadge";

describe("AdapterStatusBadge", () => {
  it("renders checking state", () => {
    render(
      <AdapterStatusBadge adapterType={null} status="checking" modelName={null} />
    );
    expect(screen.getByText("Detecting AI engine…")).toBeInTheDocument();
  });

  it("renders mock state", () => {
    render(
      <AdapterStatusBadge adapterType="mock" status="idle" modelName="mock-v1" />
    );
    expect(screen.getByText("◌ Demo mode")).toBeInTheDocument();
  });

  it("renders downloading with progress", () => {
    render(
      <AdapterStatusBadge
        adapterType="webllm"
        status="downloading"
        modelName={null}
        downloadProgress={67}
      />
    );
    expect(screen.getByText(/Loading model \[67%\]/)).toBeInTheDocument();
  });

  it("calls onInfoClick when clicked", async () => {
    const onInfoClick = vi.fn();
    const user = userEvent.setup();
    render(
      <AdapterStatusBadge
        adapterType="ollama"
        status="idle"
        modelName="qwen2.5:0.5b"
        onInfoClick={onInfoClick}
      />
    );
    await user.click(screen.getByRole("button", { name: "Adapter info" }));
    expect(onInfoClick).toHaveBeenCalledTimes(1);
  });
});
