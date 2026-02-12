export const isValidState = (newState) => {
  // input must be divisible by count
  return !(newState.userInput % newState.count);
};

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
