import { describe, it, expect, beforeEach, vi } from "vitest";
import { StateManager } from "../public/state.mjs";
import { DEFAULT_STATE } from "../public/constants.mjs";
import * as logic from "../public/logic.mjs";

describe("StateManager", () => {
  let stateManager;
  let mockCallback;

  beforeEach(() => {
    stateManager = new StateManager();
    mockCallback = vi.fn();
    stateManager.onStateUpdate(mockCallback);
    // Mock isValidUpdate to always return true for testing purposes,
    // unless specifically testing invalid updates.
    vi.spyOn(logic, "isValidUpdate").mockReturnValue(true);
  });

  it("should initialize with default state", () => {
    expect(stateManager.getCurrentState()).toEqual(DEFAULT_STATE);
    expect(mockCallback).not.toHaveBeenCalled();
  });

  it("should initialize with provided history and index", () => {
    const customHistory = [{ count: 5, redoCounter: 0, resetCounter: 0, timestamp: 0 }];
    const customIndex = 0;
    const manager = new StateManager(customIndex, customHistory);
    expect(manager.getCurrentState()).toEqual(customHistory[0]);
  });

  it("should add a new state and call the callback", () => {
    const newState = { count: 1, redoCounter: 0, resetCounter: 0, timestamp: Date.now() };
    stateManager.addState(newState);

    const currentState = stateManager.getCurrentState();
    expect(currentState.count).toBe(1);
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith(currentState);
  });

  it("should not add a state if isValidUpdate returns false", () => {
    vi.spyOn(logic, "isValidUpdate").mockReturnValue(false);
    const newState = { count: 1, redoCounter: 0, resetCounter: 0, timestamp: Date.now() };
    stateManager.addState(newState);

    expect(stateManager.getCurrentState()).toEqual(DEFAULT_STATE);
    expect(mockCallback).not.toHaveBeenCalled();
  });

  it("should undo to the previous state", () => {
    const state1 = { count: 1, redoCounter: 0, resetCounter: 0, timestamp: Date.now() };
    const state2 = { count: 2, redoCounter: 0, resetCounter: 0, timestamp: Date.now() };

    stateManager.addState(state1);
    stateManager.addState(state2);
    expect(stateManager.getCurrentState().count).toBe(2);

    const undoneState = stateManager.undo();
    expect(stateManager.getCurrentState().count).toBe(1);
    expect(undoneState.count).toBe(1);
    expect(undoneState.redoCounter).toBe(1); // redoCounter increments on undo
    expect(mockCallback).toHaveBeenCalledTimes(3); // Initial add, state1 add, state2 add, undo
  });

  it("should not undo past the first state", () => {
    stateManager.addState({ count: 1, redoCounter: 0, resetCounter: 0, timestamp: Date.now() });
    stateManager.undo();
    stateManager.undo(); // Try to undo again

    expect(stateManager.getCurrentState().count).toBe(0); // Should stay at initial default state
    expect(mockCallback).toHaveBeenCalledTimes(3); // Initial add, state1 add, undo
  });

  it("should redo to a future state", () => {
    const state1 = { count: 1, redoCounter: 0, resetCounter: 0, timestamp: Date.now() };
    const state2 = { count: 2, redoCounter: 0, resetCounter: 0, timestamp: Date.now() };

    stateManager.addState(state1);
    stateManager.addState(state2);
    stateManager.undo();
    expect(stateManager.getCurrentState().count).toBe(1);

    const redoneState = stateManager.redo();
    expect(stateManager.getCurrentState().count).toBe(2);
    expect(redoneState.count).toBe(2);
    expect(redoneState.redoCounter).toBe(1); // redoCounter increments on redo
    expect(mockCallback).toHaveBeenCalledTimes(4); // Initial add, state1 add, state2 add, undo, redo
  });

  it("should not redo past the last state", () => {
    const state1 = { count: 1, redoCounter: 0, resetCounter: 0, timestamp: Date.now() };
    stateManager.addState(state1);
    stateManager.redo(); // Try to redo when at latest state

    expect(stateManager.getCurrentState().count).toBe(1);
    expect(mockCallback).toHaveBeenCalledTimes(2); // Initial add, state1 add
  });

  it("should reset to the default state and increment resetCounter", () => {
    stateManager.addState({ count: 10, redoCounter: 0, resetCounter: 0, timestamp: Date.now() });
    expect(stateManager.getCurrentState().count).toBe(10);

    const resetState = stateManager.reset();
    expect(stateManager.getCurrentState()).toEqual({
      ...DEFAULT_STATE,
      resetCounter: 1,
    });
    expect(resetState.resetCounter).toBe(1);
    expect(mockCallback).toHaveBeenCalledTimes(2); // Initial add, state1 add, reset
  });

  it("should return JSON string of current state", () => {
    const currentState = stateManager.getCurrentState();
    expect(stateManager.toJSON()).toBe(JSON.stringify(currentState));
  });

  it("should clear future history when new state is added after undo", () => {
    const state1 = { ...DEFAULT_STATE, count: 1, redoCounter: 0, resetCounter: 0, timestamp: Date.now() + 1000 };
    const state2 = { ...DEFAULT_STATE, count: 2, redoCounter: 0, resetCounter: 0, timestamp: Date.now() + 2000 };
    const state3 = { ...DEFAULT_STATE, count: 3, redoCounter: 0, resetCounter: 0, timestamp: Date.now() + 3000 };

    stateManager.addState(state1);
    stateManager.addState(state2);
    stateManager.undo(); // Current state is state1
    stateManager.addState(state3); // Add new state, should clear state2 from history

    expect(stateManager.getCurrentState().count).toBe(3);
    stateManager.undo();
    expect(stateManager.getCurrentState().count).toBe(0); // Should be DEFAULT_STATE
    stateManager.redo();
    expect(stateManager.getCurrentState().count).toBe(3); // Should be state3
  });
});
