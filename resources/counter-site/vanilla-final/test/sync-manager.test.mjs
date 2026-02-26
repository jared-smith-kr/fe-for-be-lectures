// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from "vitest";
import { SyncManager } from "../public/sync-manager.mjs";
import { DEFAULT_STATE } from "../public/constants.mjs";

vi.useFakeTimers();
describe("SyncManager", () => {
  let syncManager;
  const SYNC_URL = "/sync-test";

  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
    vi.resetAllMocks();

    // Mock fetch
    global.fetch = vi.fn();

    // Mock localStorage
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: vi.fn(),
        setItem: vi.fn(),
        clear: vi.fn(),
      },
      writable: true,
    });

    // Mock window.location and history
    Object.defineProperty(window, "location", {
      value: {
        href: "http://localhost/",
        search: "",
      },
      writable: true,
    });
    Object.defineProperty(window, "history", {
      value: {
        replaceState: (_a, _b, u) => {
          const url = (u ?? '').toString();
          window.location.href = url;
          window.location.search = `?${url.split('?')[1] ?? ''}`;
        },
      },
      writable: true,
    });

    syncManager = new SyncManager(SYNC_URL);
  });

  describe("constructor", () => {
    it("should set the URL", () => {
      expect(syncManager.url).toBe(SYNC_URL);
    });

    it("should add online event listener if window is defined", () => {
      const addEventListenerSpy = vi.spyOn(window, "addEventListener");
      new SyncManager(SYNC_URL);
      expect(addEventListenerSpy).toHaveBeenCalledWith(
        "online",
        expect.any(Function),
      );
    });
  });

  describe("syncFromUrl", () => {
    it("should return null if no query string", () => {
      expect(syncManager.syncFromUrl("")).toBeNull();
    });

    it("should parse query string and apply transformations", () => {
      const queryString = "count=10&userInput=20";
      const xforms = { count: Number, userInput: Number };
      const result = syncManager.syncFromUrl(queryString, xforms);
      expect(result).toEqual({ count: 10, userInput: 20 });
    });

    it("should parse query string without transformations", () => {
      const queryString = "count=10&userInput=20";
      const result = syncManager.syncFromUrl(queryString);
      expect(result).toEqual({ count: "10", userInput: "20" });
    });
  });

  describe("syncToUrl", async () => {
    it("should update URL search params and replace history state", () => {
      const state = { count: 5, userInput: 10, someOtherProp: "test" };
      syncManager.syncToUrl(state);
      expect(window.location.search).toBe("?count=5&userInput=10");
    });
  });

  describe("syncServerState", () => {
    it("should fetch state from server if no state provided", async () => {
      const mockServerState = { ...DEFAULT_STATE, count: 99 };
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockServerState),
      });

      const state = await syncManager.syncServerState();
      expect(global.fetch).toHaveBeenCalledWith(SYNC_URL);
      expect(state).toEqual(mockServerState);
    });

    it("should post state to server if state provided", async () => {
      const stateToSync = { ...DEFAULT_STATE, count: 5 };
      global.fetch.mockResolvedValueOnce({ ok: true });

      await syncManager.syncServerState(stateToSync);
      expect(global.fetch).toHaveBeenCalledWith(SYNC_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(stateToSync),
      });
    });

    it("should handle offline re-sync when enqueued state exists", async () => {
      // Simulate initial failure and enqueue
      const stateToSync = { ...DEFAULT_STATE, count: 5 };
      global.fetch.mockRejectedValueOnce(new Error("Network error"));
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => { });

      await syncManager.syncServerState(stateToSync);
      consoleErrorSpy.mockRestore();

      // Simulate going online
      global.fetch.mockResolvedValueOnce({ ok: true });
      window.dispatchEvent(new Event("online"));

      // Advance timers to allow event listener to fire
      await vi.runAllTimersAsync();

      expect(global.fetch).toHaveBeenCalledWith(SYNC_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(stateToSync),
      });
    });
  });

  describe("syncLocalState", () => {
    it("should get state from localStorage if no state provided", () => {
      const mockLocalState = { ...DEFAULT_STATE, count: 42 };
      window.localStorage.getItem.mockReturnValueOnce(
        JSON.stringify(mockLocalState),
      );

      const state = syncManager.syncLocalState();
      expect(window.localStorage.getItem).toHaveBeenCalledWith("state");
      expect(state).toEqual(mockLocalState);
    });

    it("should set state in localStorage if state provided", () => {
      const stateToSync = { ...DEFAULT_STATE, count: 7 };
      syncManager.syncLocalState(stateToSync);
      expect(window.localStorage.setItem).toHaveBeenCalledWith(
        "state",
        JSON.stringify(stateToSync),
      );
    });

    it("should return null if localStorage is empty", () => {
      window.localStorage.getItem.mockReturnValueOnce(null);
      expect(syncManager.syncLocalState()).toBeNull();
    });
  });

  describe("syncState", () => {
    it("should call syncServerState, syncToUrl, and syncLocalState", async () => {
      const stateToSync = { ...DEFAULT_STATE, count: 15 };
      const syncServerStateSpy = vi
        .spyOn(syncManager, "syncServerState")
        .mockResolvedValueOnce(null);
      const syncToUrlSpy = vi.spyOn(syncManager, "syncToUrl");
      const syncLocalStateSpy = vi.spyOn(syncManager, "syncLocalState");

      const result = await syncManager.syncState(stateToSync);

      expect(syncServerStateSpy).toHaveBeenCalledWith(stateToSync);
      expect(syncToUrlSpy).toHaveBeenCalledWith(stateToSync);
      expect(syncLocalStateSpy).toHaveBeenCalledWith(stateToSync);
      expect(result).toEqual(stateToSync);
    });
  });

  describe("onload", () => {
    it("should combine states from URL, local, and server, prioritizing server", async () => {
      const mockServerState = {
        ...DEFAULT_STATE,
        count: 100,
        serverOnly: true,
      };
      const mockLocalState = { ...DEFAULT_STATE, count: 50, localOnly: true };
      const mockUrlState = { count: 10, urlOnly: true };

      vi.spyOn(syncManager, "syncServerState").mockResolvedValueOnce(
        mockServerState,
      );
      vi.spyOn(syncManager, "syncLocalState").mockReturnValueOnce(
        mockLocalState,
      );
      vi.spyOn(syncManager, "syncFromUrl").mockReturnValueOnce(mockUrlState);

      const { serverState, localState, urlState } = await syncManager.onload();
      expect(serverState).toEqual(mockServerState);
      expect(localState).toEqual(mockLocalState);
      expect(urlState).toEqual(mockUrlState);
    });
  });
});
