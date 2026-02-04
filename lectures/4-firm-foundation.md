# Lecture #4: Firm Foundations

So in the last lecture we learned about web fundamentals by doing a basic exercise. And we got a chance to start
understanding how to decouple the bits of a frontend for reuse, testability, and maintainability. We also got a chance
to see that the web platform doesn't give you a lot to work with vis-a-vis those concerns, so we got to roll our own.

This time we're going to make pinocchio a real boy by adding things to our counter app that are table stakes for modern
web applications. Things like:

- State should be persistent across page reloads. Add a reset button that resets the counter and input to zero.
- State should be persisted via a server. So if I open the app in two different browser windows, they should share the same
  counter state. We'll ignore users and authentication for now, and just have a single global counter/input state on the
  server. NOTE the state should be persisted even if there's no network connection on the client! Server should be
  synched when the client comes back online.
- There should be undo/redo functionality.
- The site should look nice, not like the current version which would have been unacceptably ugly even in 1995.
- The site should be keyboard-friendly

Some technologies you should probably familiarize yourself with to achieve these:

- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) for communicating with the server.
- [localStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) for persisting client-side
  state
- [The HTML tabindex property](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/tabindex)
  for keyboard navigation.

The server can be an extremely simple node.js express server. Given the scope increase feel free to init a project and use npm packages for some basics (no frameworks like React or Tailwind yet).

## TRY IT YOURSELF BEFORE READING FURTHER

I've created an example in the `/resources/counter-site/medium-example` directory. How does your implementation stack against mine? Lets talk about the choices made. Additionally if you feel like _this is a **lot** of code to write for a simple counter site_ you are **absolutely** correct. I'm showing you why frameworks exist before we get to them. Note that they only help with part of all of this.

Also note that this stuff is largely table stakes for a web application in Year of our Lord 2026 and this code is _still_ full of bugs and incomplete features. See if you can spot the them! (Expand the spoilers below after you've tried it yourself.)

<details>
  <summary>Spoiler Warning!</summary>

- There's a race condition where syncing the server state on page load could overwrite fresh user input if the network call succeeds but takes longer than a second or two.
- There's an invisible policy decision to take the server as the authoritative source of truth" over the local state but because we only ever send _valid_ states to the server it's possible to lose data on refresh despite the requirement of it being persisted. This is where you _should_ go back to design and product and ask about the intended experience, too many devs either don't think it through or make fiat decisions for stuff like this.
- If the user's device is offline and they update state locally, then change it again on a different (online) device, when the first device comes back online it will \*overwrite with stale state **on the server\***!
- There's no debounce or onblur for the numeric input, if a user types fast enough it's possible to accumulate a **lot** of extra states that don't actually map to anything the user intended!
- Ideally we'd like updating the state to _automatically_ trigger a re-render without having to call `render` in event handlers.
- undo/redo history is not persisted. If you refresh you get the current state but lose all context!
</details>

And that's just the ones that I noticed! Did your implementation have the same issues? Did you notice any other issues with either my implemenattion or your own?

...aaaand now you know why I said web programming was difficult. The platform fights you every step of the way: it just wasn't _designed_ to do this sort of thing.
