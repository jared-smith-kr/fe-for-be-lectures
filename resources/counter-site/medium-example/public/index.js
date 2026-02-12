/*
 * Some notes about this code:
 *
 * - no implicit dependencies in the logic functions: no DOM, no
 *   direct read of state. Easy to follow, easy to test, easy to refactor.
 * - Although this isn't Typescript we've made explicit type conversions
 * - Everything is testable and we use composition of simple one-job
 *   functions, there's almost no logic in this at all.
 */
import {
  checkInputValidity,
  displayCount,
  displayResult,
  isValidState,
} from "./logic.mjs";
import { SyncManager } from "./sync-manager.mjs";
import { StateManager } from "./state.mjs";

const syncMgr = new SyncManager("/sync-count");
const stateMgr = new StateManager();

const counterIncrementor = document.getElementById("incr-count");
const counterOutput = document.getElementById("counter-output");
const resultOutput = document.getElementById("result-output");
const dividendInput = document.getElementById("dividend");
const undoBttn = document.getElementById("undo-bttn");
const redoBttn = document.getElementById("redo-bttn");
const resetBttn = document.getElementById("reset-bttn");

/*
 * we don't export the following functions since they depend on DOM
 * and should _probably_ be tested via integration tests rather than
 * mocking out a bunch of stuff and using isolated unit tests. They are
 * also all relatively simple compositions of the (well-tested) utilities
 * above, so you could reasonably decide to forgo tests for these entirely.
 */

const render = (state) => {
  checkInputValidity(dividendInput, state);
  displayCount(counterOutput, state.count);
  displayResult(resultOutput, state);
  dividendInput.value = state.userInput;
};

// NOTE: the syncManager should _only_ be responsible for communication
// with the server, DO NOT make it aware of state validation. That's the
// *state*Manager's job. Writing this function isn't that hard.
const validateAndSync = (newState) => {
  if (isValidState(newState)) {
    syncMgr.syncState(newState);
  }

  return newState;
};

const updateState = (newState) => {
  validateAndSync(newState);
  return stateMgr.addState(newState).getCurrentState();
};

counterIncrementor.addEventListener("click", (_evt) => {
  const state = stateMgr.getCurrentState();
  render(updateState({ ...state, count: state.count + 1 }));
});

dividendInput.addEventListener("input", (evt) => {
  const state = stateMgr.getCurrentState();
  render(updateState({ ...state, userInput: Number(evt.data) }));
});

undoBttn.addEventListener("click", (_evt) => {
  render(validateAndSync(stateMgr.undo()));
});

redoBttn.addEventListener("click", (_evt) => {
  render(validateAndSync(stateMgr.redo()));
});

resetBttn.addEventListener("click", (_evt) => {
  render(validateAndSync(stateMgr.reset()));
});

window.addEventListener("DOMContentLoaded", async () => {
  const state = await syncMgr.onload();
  stateMgr.addState(state);
  render(state);
});
