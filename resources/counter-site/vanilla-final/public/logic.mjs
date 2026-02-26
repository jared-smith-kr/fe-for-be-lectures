import { DEFAULT_STATE } from "./constants.mjs";

export const isCompleteState = (state) => {
  return Object.keys(DEFAULT_STATE).every((k) => k in state);
};

export const isValidNumeric = (newState) => {
  // input must be divisible by count
  return (
    (newState.count === 0 && newState.userInput === 0) ||
    !(newState.userInput % newState.count)
  );
};

export const isValidUpdate = (currentState, newState) => {
  return (
    !currentState.timestamp ||
    (newState.timestamp && newState.timestamp > currentState.timestamp)
  );
};

export const isValidState = (state) =>
  isCompleteState(state) && isValidNumeric(state);

export const displayCount = (elem, count) => {
  elem.textContent = String(count);
};

export const checkInputValidity = (elem, newState) => {
  elem.setCustomValidity(
    isValidState(newState) ? "" : "Not divisible by the current count!",
  );
  elem.reportValidity();
};

export const displayResult = (elem, newState) => {
  elem.textContent =
    isValidState(newState) && newState.count != 0
      ? String(newState.userInput / newState.count)
      : "N/A";
};
