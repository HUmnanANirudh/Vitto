import { config } from "dotenv";
config({ path: ".env" });

import { vi } from "vitest";

vi.mock("firebase-admin/app", () => ({
  getApps: vi.fn(() => []),
  initializeApp: vi.fn(),
}));

vi.mock("firebase-admin/auth", () => ({
  getAuth: vi.fn(() => ({
    verifyIdToken: vi.fn(async (token: string) => {
      if (token === "valid-token") {
        return { uid: "test-firebase-uid", email: "test@vitto.com", name: "Test User" };
      }
      throw new Error("Invalid token");
    }),
  })),
}));
