import { DEFAULT_STATE } from "./constants.mjs";
import { isValidUpdate } from "./logic.mjs";

export class StateManager {
  #history = [{ ...DEFAULT_STATE }];
  #currentIndex = 0;
  #stateUpdateCallback = null;

  constructor(currentIndex, history) {
    if (typeof currentIndex === "number" && Array.isArray(history)) {
      this.#currentIndex = currentIndex;
      this.#history = history;
    }
  }

  onStateUpdate(cb) {
    this.#stateUpdateCallback = cb;
    return this;
  }

  addState(newState) {
    const currentState = this.getCurrentState();
    if (!isValidUpdate(currentState, newState)) {
      console.warn(
        `Refusing to update to older state from ${new Date(newState.timestamp).toString()}`,
      );
      return this;
    }

    const state = Object.assign({}, currentState, newState, {
      timestamp: Date.now(),
    });

    let historyWasSliced = false;
    if (
      this.#history.length &&
      !(this.#currentIndex === this.#history.length - 1)
    ) {
      this.#history = this.#history.slice(0, this.#currentIndex);
      historyWasSliced = true;
    }

    this.#history.push(state);
    if (historyWasSliced) {
      this.#currentIndex = this.#history.length - 1; // Point to the newly added state
    } else {
      this.#currentIndex++;
    }

    this.#stateUpdateCallback?.(state);

    return this;
  }

  getCurrentState() {
    return this.#history[this.#currentIndex];
  }

  undo() {
    this.#currentIndex--;
    if (this.#currentIndex < 0) this.#currentIndex = 0;

    const state = this.getCurrentState();
    state.redoCounter += 1;
    this.#stateUpdateCallback?.(state);

    return state;
  }

  redo() {
    if (this.#currentIndex < this.#history.length - 1) this.#currentIndex++;

    const state = this.getCurrentState();
    state.redoCounter += 1;
    this.#stateUpdateCallback?.(state);

    return state;
  }

  reset() {
    const oldState = this.getCurrentState();
    const resetCtr = oldState.resetCounter;
    this.#history = [{ ...DEFAULT_STATE }];
    this.#currentIndex = 0;

    const state = this.getCurrentState();
    state.resetCounter = resetCtr + 1;
    this.#stateUpdateCallback?.(state);

    return state;
  }

  toJSON() {
    return JSON.stringify(this.getCurrentState());
  }
}
