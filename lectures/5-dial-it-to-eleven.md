# Crank it up a Notch

Last time we added some table-stakes features to our counter app. This time we're going even further beyond:

- The site should track interaction stats.
  - how many times the user bumped the counter
  - how many times the user used the reset feature
  - how many times the user input a number
  - How many times user did undo/redo
  - this should all be synced to the server
  - this info should be in a popup or tooltip that doesn't show until the user clicks a button
  - the popup needs a dismiss button
  - the open/closed state of the popup should persist across reloads
- The counter and input state should be part of the URL. I should be able to hand somebody else a url and have them get to the same state I'm currently in. The popup state should **not** be part of the url, only the numbers. You should no longer need to track the counter and input numbers on the server.
- The site should work across a variety of screen sizes and viewports. You should have your button/input styled for tap interactions on mobile web
- Fix everything from the spoiler section of the last lecture

Some resources:

- The [History API](https://developer.mozilla.org/en-US/docs/Web/API/History/replaceState)
- The [Dialog Element](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog)
- [Mobile web button size guidelines](https://uxmovement.com/mobile/optimal-size-and-spacing-for-mobile-buttons/)

## TRY IT YOURSELF BEFORE PROCEEDING

Before looking at the solution, try to implement these features yourself. You can use any tools or libraries you like (no frameworks like React/Vue/Angular or Tailwind, but small libraries are fine), or none at all. When you're ready, check out the solution below.

## SOLUTION

Check [it out](../resources/counter-site/vanilla-final)!

Next time we'll finally talk about frameworks and how they can help with this sort of thing.
