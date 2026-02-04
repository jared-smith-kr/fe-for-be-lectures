// I'm not pulling in an entire testing framework for this. But
// for "real" work you should absolutely use something like vitest.
import {
  checkInputValidity,
  displayResult,
  displayCount,
  isValidateState,
} from "./logic.mjs";

class FakeHTMLElement {
  addEventListener(_kind, _f) {}
  textContent = "";
}

class FakeInputElement extends FakeHTMLElement {
  isValid = true;
  reportValidity() {}
  setCustomValidity(msg) {
    this.isValid = !msg;
  }
}

const makeFakeState = (count = 0, userInput = 0) => ({
  count,
  userInput,
});

// checkInputValidity
{
  const inp = new FakeInputElement();
  checkInputValidity(inp, makeFakeState(2, 4));
  console.assert(
    inp.isValid === true,
    "input should be valid is the value is divisible by the count",
  );
  checkInputValidity(inp, makeFakeState(3, 5));
  console.assert(
    inp.isValid === false,
    "input should not be valid is the value is not divisible by the count",
  );
}

// isValidState
{
  console.assert(
    isValidateState(makeFakeState(3, 5)) === false,
    "state is not valid if userInput is not divisible by count",
  );
  console.assert(
    isValidateState(makeFakeState(2, 4) === true),
    "state is valid if userInput is divisible by count",
  );
}

// displayCount
{
  const countOut = new FakeHTMLElement();
  displayCount(countOut, 5);
  console.assert(
    (countOut.textContent = "5"),
    "element argument should display the passed-in count",
  );
}

// displayResult
{
  const resultOut = new FakeHTMLElement();
  displayResult(resultOut, makeFakeState(2, 4));
  console.assert(
    resultOut.textContent === "2",
    "element argument should display the passed-in state after performing the division operation",
  );
  displayResult(resultOut, makeFakeState());
  console.assert(
    resultOut.textContent === "N/A",
    "element should display an appropriate message if there would be a division-by-zero error",
  );
}
