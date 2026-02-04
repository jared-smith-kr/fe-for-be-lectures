# The Wrong Way Everybody Teaches

This is how you make a basic web page, at least according to a lot of books and tutorials. Nobody actually does this anymore in non-academic contexts, probably not for the last 15-20 years, although it's making something of a comeback. We'll talk about why later. Headache _first_, _then_ aspirin.

```html
<!doctype html>
<html lang="en">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>My Awesome Webpage</title>
    <style>
      html,
      body {
        margin: 0;
        padding: 0;
      }

      .text-stuff {
        float: left;
      }

      .image-of-cat {
        float: right;
      }
    </style>
  </head>
  <body>
    <h1>My Awesome Website!</h1>
    <p class="text-stuff">I have an awesome website. Check out my cat!</p>
    <img class="image-of-cat" src="../resources/cat.jpeg" />
  </body>
</html>
```

This is honestly fine for a static page with limited content. Note that basically no website falls into that category anymore. To show what I mean, lets build a page with a counter that increases when you click a button:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>County McCounterson</title>
    <style>
      html,
      body {
        margin: 0;
        padding: 0;
      }
    </style>
  </head>
  <body>
    <h1>Make Number Go Up</h1>
    <p id="counter-output">0</p>
    <button id="incr-count">Click Me!</button>
  </body>
  <script>
    let count = 0;
    document
      .getElementById("incr-count")
      .addEventListener("click", function (evt) {
        count++;
        document.getElementById("counter-output").textContent = String(count);
      });
  </script>
</html>
```

This is _still_ fine but again no actual website is like this. To give some flavor there's a copy of the above in the `/resources` directory. Edit it to include the following:

- A numeric text input that the user can input a number into. The number must be a multiple of the current count to be
  valid (validation, state syncing).
- An output that prints the text number divided by the current count (derived output). Should update when either value
  changes.
- The button should be positioned below the count output but above the numeric input. (NOTE: should be done via CSS not by adding extra HTML elements)
- **Meaningful automated tests.** Can you test your business logic without a browser?
- Separate CSS and JS out into their own files.

## SERIOUSLY, TRY THE ABOVE BEFORE CONTINUING READING

So now you should be starting to see the limits of "traditional" webdev. Doing work in event handlers mixes business logic with presentational concerns in a way that makes it hard to test. Treating the DOM as a source of truth incurs a heavy cost, but if you keep it in a Javascript data structure for consistency and validation you now have a syncing problem back to the DOM for presentation. Your styles and behaviors are _heavily_ coupled to your markup despite those being theoretically separate concerns that have their own programming languages.

If you want a look at a middle-ground approach between how we do things today on web and the examples in this document, check out [the minimal example version](../resources/counter-site/minimal-example/) of the counter site that I wrote. Does it look like what you wrote?
