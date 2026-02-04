export const DEFAULT_STATE = { count: 0, userInput: 0 };
export class StateManager {
  #history = [DEFAULT_STATE];
  #currentIndex = 0;

  addState(state) {
    if (
      this.#history.length &&
      !(this.#currentIndex === this.#history.length - 1)
    ) {
      // If there's a redo timeline, reset to the point of the current
      // state and start adding the fresh action to create a new redo
      // timeline.
      this.#history = this.#history.slice(0, this.#currentIndex);
    }

    this.#history.push(state);
    this.#currentIndex++;
    return this;
  }

  getCurrentState() {
    return this.#history[this.#currentIndex];
  }

  undo() {
    this.#currentIndex--;
    if (this.#currentIndex < 0) this.#currentIndex = 0;
    return this.getCurrentState();
  }

  redo() {
    if (this.#currentIndex < this.#history.length - 1) this.#currentIndex++;
    return this.getCurrentState();
  }

  reset() {
    this.#history = [DEFAULT_STATE];
    this.#currentIndex = 0;
    return this.getCurrentState();
  }

  toJSON() {
    return JSON.stringify(this.#history[this.#currentIndex]);
  }
}
