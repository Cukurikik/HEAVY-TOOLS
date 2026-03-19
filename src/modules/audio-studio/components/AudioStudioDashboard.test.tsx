import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AudioStudioDashboard } from "./AudioStudioDashboard";
import { AUDIO_TOOLS } from "../constants/tools";
import React from "react";
import * as useAudioStoreModule from "../store/useAudioStore";

// Mock next/link
vi.mock("next/link", () => {
  return {
    default: ({ children, href, className }: { children: React.ReactNode, href: string, className: string }) => (
      <a href={href} className={className} data-testid="tool-link">
        {children}
      </a>
    ),
  };
});

// Mock framer-motion
vi.mock("framer-motion", () => {
  return {
    motion: {
      div: ({ children, className }: { children: React.ReactNode, className?: string }) => (
        <div className={className}>{children}</div>
      ),
    },
  };
});

// Mock useAudioStore
const mockSetFile = vi.fn();
const mockSetOperation = vi.fn();
const mockProcessAudio = vi.fn();
const mockReset = vi.fn();

vi.mock("../store/useAudioStore", () => ({
  useAudioStore: vi.fn(),
}));

describe("AudioStudioDashboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Setup default mock return
    (useAudioStoreModule.useAudioStore as any).mockReturnValue({
      task: { status: "idle", file: null },
      setFile: mockSetFile,
      setOperation: mockSetOperation,
      processAudio: mockProcessAudio,
      reset: mockReset,
    });
  });

  it("renders correctly and displays all tools", () => {
    render(<AudioStudioDashboard />);

    const toolLinks = screen.getAllByTestId("tool-link");
    expect(toolLinks).toHaveLength(AUDIO_TOOLS.length);

    const trimmerTool = AUDIO_TOOLS.find((t) => t.id === "trimmer");
    if (trimmerTool) {
      expect(screen.getByText(trimmerTool.name)).toBeInTheDocument();
      expect(screen.getByText(trimmerTool.desc)).toBeInTheDocument();
    }
  });

  it("has correct href attributes for tool links", () => {
    render(<AudioStudioDashboard />);

    const firstTool = AUDIO_TOOLS[0];
    const lastTool = AUDIO_TOOLS[AUDIO_TOOLS.length - 1];

    expect(document.querySelector(`a[href="/audio/${firstTool.id}"]`)).toBeInTheDocument();
    expect(document.querySelector(`a[href="/audio/${lastTool.id}"]`)).toBeInTheDocument();
  });

  it("handles drag events correctly to update UI state", () => {
    render(<AudioStudioDashboard />);

    const container = screen.getByTestId("dashboard-container");

    // Initially should not have active drag styles
    expect(container.className).not.toContain("bg-violet-900/20");

    // Fire dragenter event
    fireEvent.dragEnter(container);
    expect(container.className).toContain("bg-violet-900/20");
    expect(container.className).toContain("border-dashed");

    // Fire dragleave event
    fireEvent.dragLeave(container);
    expect(container.className).not.toContain("bg-violet-900/20");
  });

  it("handles file drop and calls setFile", () => {
    render(<AudioStudioDashboard />);

    const container = screen.getByTestId("dashboard-container");

    // Create a mock file
    const file = new File(["dummy content"], "test-audio.mp3", { type: "audio/mp3" });

    // Simulate drop event
    fireEvent.drop(container, {
      dataTransfer: {
        files: [file],
      },
    });

    // Verify that the store function was called with the file
    expect(mockSetFile).toHaveBeenCalledTimes(1);
    expect(mockSetFile).toHaveBeenCalledWith(file);

    // Verify UI resets back
    expect(container.className).not.toContain("bg-violet-900/20");
  });

  it("handles drop event with no files safely", () => {
    render(<AudioStudioDashboard />);

    const container = screen.getByTestId("dashboard-container");

    // Simulate drop event with no files
    fireEvent.drop(container, {
      dataTransfer: {
        files: [],
      },
    });

    // Verify that the store function was NOT called
    expect(mockSetFile).not.toHaveBeenCalled();

    // Verify UI resets back
    expect(container.className).not.toContain("bg-violet-900/20");
  });
});
