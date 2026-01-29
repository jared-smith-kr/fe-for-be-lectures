/*
 * Some notes about this code:
 * - no implicit dependencies in the logic functions: no DOM, no direct read of state. Easy to follow, easy to
 *   test, easy to refactor.
 * - Although this isn't Typescript we've made explicit type conversions
 * - Everything is testable and we use composition of simple one-job functions.
 */
import { checkInputValidity, displayCount, displayResult } from "./logic.mjs";

let state = {
  count: 0,
  userInput: 0,
};

const counterIncrementor = document.getElementById("incr-count");
const counterOutput = document.getElementById("counter-output");
const resultOutput = document.getElementById("result-output");
const dividendInput = document.getElementById("dividend");

/*
 * we don't export the following functions since they depend on DOM
 * and should _probably_ be tested via integration tests rather than
 * mocking out a bunch of stuff and using isolated unit tests. They are
 * also all relatively simple compositions of the (well-tested) utilities
 * above, so you could reasonably decide to forgo tests for these entirly.
 */

const render = (state) => {
  checkInputValidity(dividendInput, state);
  displayCount(counterOutput, state.count);
  displayResult(resultOutput, state);
};

const updateState = (newState) => {
  // Note that we don't validate, otherwise we prohibit the user
  // from doing any input!
  state = newState;
  return state;
};

counterIncrementor.addEventListener("click", (_evt) =>
  render(updateState({ ...state, count: state.count + 1 })),
);

dividendInput.addEventListener("input", (evt) => {
  render(updateState({ ...state, userInput: Number(evt.data) }));
});
