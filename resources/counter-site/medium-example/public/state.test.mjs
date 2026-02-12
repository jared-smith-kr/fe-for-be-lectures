import { DEFAULT_STATE, StateManager } from "./state.mjs";

// Test DEFAULT_STATE
{
  console.assert(
    DEFAULT_STATE.count === 0,
    "DEFAULT_STATE.count should be 0",
  );
  console.assert(
    DEFAULT_STATE.userInput === 0,
    "DEFAULT_STATE.userInput should be 0",
  );
}

// Test StateManager instantiation and initial state
{
  const sm = new StateManager();
  console.assert(
    sm.getCurrentState() === DEFAULT_STATE,
    "Initial state should be DEFAULT_STATE",
  );
}

// Test addState and getCurrentState
{
  const sm = new StateManager();
  const state1 = { count: 1, userInput: 10 };
  sm.addState(state1);
  console.assert(
    sm.getCurrentState() === state1,
    "getCurrentState should return the last added state",
  );

  const state2 = { count: 2, userInput: 20 };
  sm.addState(state2);
  console.assert(
    sm.getCurrentState() === state2,
    "getCurrentState should return the latest added state",
  );
}

// Test undo
{
  const sm = new StateManager();
  const state1 = { count: 1, userInput: 10 };
  const state2 = { count: 2, userInput: 20 };
  sm.addState(state1).addState(state2);

  sm.undo();
  console.assert(
    sm.getCurrentState() === state1,
    "undo should return the previous state",
  );

  sm.undo();
  console.assert(
    sm.getCurrentState() === DEFAULT_STATE,
    "undo should return to DEFAULT_STATE",
  );

  sm.undo(); // Should not go below DEFAULT_STATE
  console.assert(
    sm.getCurrentState() === DEFAULT_STATE,
    "undo should not go below initial state",
  );
}

// Test redo
{
  const sm = new StateManager();
  const state1 = { count: 1, userInput: 10 };
  const state2 = { count: 2, userInput: 20 };
  sm.addState(state1).addState(state2);

  sm.undo();
  sm.undo();
  console.assert(
    sm.getCurrentState() === DEFAULT_STATE,
    "after two undos, current state should be DEFAULT_STATE",
  );

  sm.redo();
  console.assert(
    sm.getCurrentState() === state1,
    "redo should move to the next state in history",
  );

  sm.redo();
  console.assert(
    sm.getCurrentState() === state2,
    "redo should move to the latest state in history",
  );

  sm.redo(); // Should not go beyond the latest state
  console.assert(
    sm.getCurrentState() === state2,
    "redo should not go beyond the latest state",
  );
}

// Test addState after undo (branching timeline)
{
  const sm = new StateManager();
  const state1 = { count: 1, userInput: 10 };
  const state2 = { count: 2, userInput: 20 };
  const state3 = { count: 3, userInput: 30 }; // New state after undo

  sm.addState(state1).addState(state2);
  sm.undo(); // Back to state1
  console.assert(
    sm.getCurrentState() === state1,
    "should be at state1 after undo",
  );

  sm.addState(state3); // Add state3, state2 should be gone from history
  console.assert(
    sm.getCurrentState() === state3,
    "current state should be state3 after adding it",
  );

  sm.redo(); // Should not be able to redo to state2
  console.assert(
    sm.getCurrentState() === state3,
    "redo should not work after adding a new state in a different timeline",
  );

  sm.undo();
  console.assert(
    sm.getCurrentState() === state1,
    "undo should go back to state1 from state3",
  );
}

// Test reset
{
  const sm = new StateManager();
  const state1 = { count: 1, userInput: 10 };
  sm.addState(state1);
  sm.reset();
  console.assert(
    sm.getCurrentState() === DEFAULT_STATE,
    "reset should return to DEFAULT_STATE",
  );
  sm.undo();
  console.assert(
    sm.getCurrentState() === DEFAULT_STATE,
    "after reset and undo, should still be DEFAULT_STATE",
  );
  sm.redo();
  console.assert(
    sm.getCurrentState() === DEFAULT_STATE,
    "after reset and redo, should still be DEFAULT_STATE",
  );
}

// Test toJSON
{
  const sm = new StateManager();
  const state1 = { count: 1, userInput: 10 };
  sm.addState(state1);
  console.assert(
    sm.toJSON() === JSON.stringify(state1),
    "toJSON should return JSON string of the current state",
  );
  sm.undo();
  console.assert(
    sm.toJSON() === JSON.stringify(DEFAULT_STATE),
    "toJSON should return JSON string of DEFAULT_STATE after undo",
  );
}
