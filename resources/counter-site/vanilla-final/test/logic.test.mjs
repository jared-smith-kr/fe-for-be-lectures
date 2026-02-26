import { describe, it, expect, beforeEach } from "vitest";
import {
  checkInputValidity,
  displayResult,
  displayCount,
  isValidState,
  isCompleteState,
  isValidNumeric,
  isValidUpdate,
} from "../public/logic.mjs";
import { DEFAULT_STATE } from "../public/constants.mjs";

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
  ...DEFAULT_STATE,
  count,
  userInput,
});

describe("logic.mjs", () => {
  describe("checkInputValidity", () => {
    let inp;
    beforeEach(() => {
      inp = new FakeInputElement();
    });

    it("should set input to valid if the value is divisible by the count", () => {
      checkInputValidity(inp, makeFakeState(2, 4));
      expect(inp.isValid).toBe(true);
    });

    it("should set input to invalid if the value is not divisible by the count", () => {
      checkInputValidity(inp, makeFakeState(3, 5));
      expect(inp.isValid).toBe(false);
    });
  });

  describe("isValidState", () => {
    it("should return false if userInput is not divisible by count", () => {
      expect(isValidState(makeFakeState(3, 5))).toBe(false);
    });

    it("should return true if userInput is divisible by count", () => {
      expect(isValidState(makeFakeState(2, 4))).toBe(true);
    });
  });

  describe("displayCount", () => {
    it("should display the passed-in count", () => {
      const countOut = new FakeHTMLElement();
      displayCount(countOut, 5);
      expect(countOut.textContent).toBe("5");
    });
  });

  describe("displayResult", () => {
    let resultOut;
    beforeEach(() => {
      resultOut = new FakeHTMLElement();
    });

    it("should display the passed-in state after performing the division operation", () => {
      displayResult(resultOut, makeFakeState(2, 4));
      expect(resultOut.textContent).toBe("2");
    });

    it("should display an appropriate message if there would be a division-by-zero error", () => {
      displayResult(resultOut, makeFakeState());
      expect(resultOut.textContent).toBe("N/A");
    });
  });

  describe("isCompleteState", () => {
    it("should return true for a complete state", () => {
      expect(isCompleteState(DEFAULT_STATE)).toBe(true);
    });

    it("should return false for an incomplete state", () => {
      const incompleteState = { count: 0 };
      expect(isCompleteState(incompleteState)).toBe(false);
    });
  });

  describe("isValidNumeric", () => {
    it("should return true if userInput is divisible by count", () => {
      expect(isValidNumeric(makeFakeState(2, 4))).toBe(true);
    });

    it("should return true if both count and userInput are zero", () => {
      expect(isValidNumeric(makeFakeState(0, 0))).toBe(true);
    });

    it("should return false if userInput is not divisible by count", () => {
      expect(isValidNumeric(makeFakeState(3, 5))).toBe(false);
    });
  });

  describe("isValidUpdate", () => {
    it("should return true if newState has a later timestamp", () => {
      const currentState = { timestamp: 100 };
      const newState = { timestamp: 200 };
      expect(isValidUpdate(currentState, newState)).toBe(true);
    });

    it("should return false if newState has an earlier timestamp", () => {
      const currentState = { timestamp: 200 };
      const newState = { timestamp: 100 };
      expect(isValidUpdate(currentState, newState)).toBe(false);
    });

    it("should return true if currentState has no timestamp", () => {
      const currentState = {};
      const newState = { timestamp: 100 };
      expect(isValidUpdate(currentState, newState)).toBe(true);
    });

    it("should return true if newState has no timestamp and currentState has no timestamp", () => {
        const currentState = {};
        const newState = {};
        expect(isValidUpdate(currentState, newState)).toBe(true);
    });
  });
});
