/*
 * Some notes about this code:
 *
 * - no implicit dependencies in the logic functions: no DOM, no
 *   direct read of state. All of the "wiring up" is here in this
 *   file: Easy to follow, easy to test, easy to refactor.
 * - Although this isn't Typescript we've made explicit type conversions
 * - Almost everything is minimal composition of simple one-job
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
import { debounce } from "./utils.mjs";
import { DEFAULT_STATE } from "./constants.mjs";

const syncMgr = new SyncManager("/sync-count");
const stateMgr = new StateManager();

const counterIncrementor = document.getElementById("incr-count");
const counterOutput = document.getElementById("counter-output");
const resultOutput = document.getElementById("result-output");
const dividendInput = document.getElementById("dividend");
const undoBttn = document.getElementById("undo-bttn");
const redoBttn = document.getElementById("redo-bttn");
const resetBttn = document.getElementById("reset-bttn");
const counterStat = document.getElementById("counter-incr-stat");
const inputStat = document.getElementById("input-stat");
const undoStat = document.getElementById("undo-stat");
const redoStat = document.getElementById("redo-stat");
const resetStat = document.getElementById("reset-stat");
const statsDialog = document.getElementById("stats-dialog");
const showStats = document.getElementById("show-stats");
const hideStats = document.getElementById("dimiss-dialog");

/*
 * we don't export the following functions since they depend on DOM
 * and should _probably_ be tested via integration tests rather than
 * mocking out a bunch of stuff and using isolated unit tests. They are
 * also all relatively simple compositions of the (well-tested) utilities
 * in logic.mjs, so you could reasonably decide to forgo tests for these
 * entirely.
 */

const render = (state) => {
  checkInputValidity(dividendInput, state);
  displayCount(counterOutput, state.count);
  displayResult(resultOutput, state);
  dividendInput.value = state.userInput;
  counterStat.textContent = state.incrCounter;
  inputStat.textContent = state.inputCounter;
  undoStat.textContent = state.undoCounter;
  redoStat.textContent = state.redoCounter;
  resetStat.textContent = state.resetCounter;
};

// NOTE: the syncManager should _only_ be responsible for communication
// with the server, DO NOT make it aware of state validation.
const validateAndSync = (newState) => {
  if (isValidState(newState)) {
    syncMgr.syncState(newState);
  }

  return newState;
};

const updateState = (newState) => {
  const result = stateMgr.addState(newState).getCurrentState();
  validateAndSync(result);
  return result;
};

// Wire everything up once the DOM has loaded
window.addEventListener("DOMContentLoaded", async () => {
  counterIncrementor.addEventListener("click", (_evt) => {
    const state = stateMgr.getCurrentState();
    updateState({
      ...state,
      count: state.count + 1,
      incrCounter: state.incrCounter + 1,
      timestamp: Date.now(),
    });
  });

  dividendInput.addEventListener(
    "input",
    debounce(500, (evt) => {
      const state = stateMgr.getCurrentState();
      updateState({
        ...state,
        userInput: Number(evt.data),
        inputCounter: state.inputCounter + 1,
        timestamp: Date.now(),
      });
    }),
  );

  showStats.addEventListener("click", (_evt) => {
    statsDialog.showModal();
  });

  hideStats.addEventListener("click", (_evt) => {
    statsDialog.close();
  });

  undoBttn.addEventListener("click", (_evt) => {
    validateAndSync(stateMgr.undo());
  });

  redoBttn.addEventListener("click", (_evt) => {
    validateAndSync(stateMgr.redo());
  });

  resetBttn.addEventListener("click", (_evt) => {
    validateAndSync(stateMgr.reset());
  });

  stateMgr.onStateUpdate((state) => {
    render(state);
    validateAndSync(state);
  });

  const { localState, serverState, urlState } = await syncMgr.onload();

  if (
    localState &&
    serverState &&
    localState.timestamp > serverState.timestamp
  ) {
    const current = { ...localState, ...urlState };
    stateMgr.addState(current);
    validateAndSync(current);
  } else {
    const current = {
      ...(serverState ?? localState ?? DEFAULT_STATE),
      ...urlState,
    };
    stateMgr.addState(current);
  }
});
