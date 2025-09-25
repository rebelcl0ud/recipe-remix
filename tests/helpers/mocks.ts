import { vi } from "vitest";
import { Session } from "@remix-run/node";

function createMockSession(overrides: Partial<Session> = {}): Session {
  return {
    data: {},
    id: "mock-session-id",
    flash: vi.fn(),
    get: vi.fn(() => undefined) as Session["get"],
    has: vi.fn(),
    set: vi.fn(),
    unset: vi.fn(),
    ...overrides,
  };
}

export { createMockSession };
