# Web Frontend and its Discontents

The first thing that you have to understand about web frontend is that it is _somewhat_ of a unique beast. Web browsers were designed in the late 80s for viewing almost entirely static, hyperlinked documents. Think 'Wikipedia'. Over the years we have grafted a general purpose software delivery platform onto them like Frankenstein's monster sewn to the side of a puppy. What this means in practice is that the implementation of a web frontend written in Javascript will be very different than a frontend written in a language like Swift or Kotlin for native iOS or Android apps, or traditional desktop apps, or even web frontends written in server-side languages like PHP or Ruby. The vestigial document-based heritage pokes through all over the place, like we tried to fit a balloon around a cactus. The impedance mismatch is, in my opinion, the leading factor in why Javascript frameworks are popular and yet so frustrating to work with: they are trying to paper over the cracks in a fundamentally flawed foundation.

But with that being said, all frontends regardless of implementation details or ecosystem quirks share certain common needs, and it is **critical** that as a backend and/or full stack developer you understand what they are. If you were a rank beginner it would be more important to start with the hows of HTTP, HTML, CSS, etc but since you are an experienced engineer I think it's more valuable to start with how the frontend fits into the overall system. Cards on the table: while I've done frontend work off and on my entire career yet I am by inclination _far_ more comfortable on the backend. I'm more of a computer sciency guy than latte-chugging UX designer type. But remember, you can have a useful frontend (e.g. note-taking, guitar tuning, etc) without a backend, but you cannot have a useful backend without a frontend. The frontend _is_ the product, it is the closest proxy we have to the user and therefore its needs are paramount.

## Frontend Needs

Every frontend will need at least one of the following, many will need all of them:

- Display data to the user in a human-friendly way (views)
- Allow the user to input/update data in a persistent way (could be on device, on a server, or both)
- Allow the user to transform data from one format to another (convert text to pdf, png to jpg, etc)
- Act as the trigger for some larger process (send an email, launch a nuke, etc)
- Maintain data in a consistent, coherent state in the face of user attempts to edit that state (validation)
- Remain responsive while doing multiple things at once (concurrency)
- Keep a record of what the user has done (history/undo)
- **Act as a translation layer between how computers see the world and how humans see the world for both reads and
  writes**.

The last point is bolded because it's both the most important and the most frequently overlooked. To give you an example of what I mean, consider what happens when you hit cmd-z in your text editor. Does it undo character-by-character? No? But the input was character by character as you typed. How does the editor chunk that for undo/redo? This is a simple example that you've experienced basically every single day of your professional career but probably never thought about. The frontend has to take the low-level stream of input events from the keyboard and mouse and turn them into an event that is _meaningful to the user_. This is true for all user interactions, and it's why almost all software today sucks: we have allowed the way backends see the world and the technological pecularities of our stacks (e.g. database tables in 3rd normal form) to leak into the user experience. What is a meaningful atomic action to the user **rarely** maps well on to what is optimal from a backend point of view. Consider a PUT or POST request that updates 7+ distinct tables in a relational database (with or without the facade of an ORM). What are the odds that you can correctly undo that action? How resuable are any of the components of that bespoke "REST" endpoint? And yet, this is by far the most common way to implement a service or domain interface!

None of that is to say that any of those technologies are inherently bad: I'm a big fan of relational databases. But our _usage_ of those technologies as an industry is _terrible_. We design schemas based on how it's convenient to implement and store the data rather than by the semantics of the domain we're trying to model. Don't get me wrong, that sort of data modelling is **hard**, just like deciding how to collate input into user-meaningful events is hard, and for the exact same reason. But so, so often we just don't even _try_ anymore. Actually it's even worse than that: many of us aren't even _aware_ that there's something there to be attempted, the worldview is _entirely_ constrained by the needs and quirks of decades-old technologies. If I had to name a culprit, I'd pick the fallacious idea that we can somehow split the backend and frontend and the majority of software developers can build something useful without ever thinking about the actual end users. Of course as a full stack developer I _would_ say that :P. And to be fair, frontend engineers can be just as guilty: arguing about whether the latest Javascript framework is better than the last 13 Javascript frameworks is easier and more fun than trying to actually understand and satisfy user needs.

But anyways, it doesn't _have_ to be this way, and it shouldn't: we should be building proper [affordances](https://en.wikipedia.org/wiki/Affordance) for our
users. When we get it wrong we get this:

![Push door with a pull handle and a sign saying 'PUSH'](../resources/norman_door.jpeg?raw=true)

## The Anatomy of a Frontend

Historically speaking, a frontend will consist of 3 layers:

- A **View**, which is what is displayed to the user
- A **Model**, which is the state of the application (in business-logic terms)
- A **Controller** that mediates the interaction between them

This is the traditional concept of **MVC** (Model View Controller). This is a neat dictionary definition that breaks down in practice almost immediately when not enforced by the platform, and even 40+ years after its invention we're still [arguing about the specifics of what that means](https://acko.net/blog/model-view-catharsis/) in a given app. The actually important takeaway here is that in frontend we want to separate presentational concerns from the concerns of data and application state. There are various ways to accomplish this but the goals are reasonability and correctness: it's very, **very** hard to debug your app or even understand it at all when the business logic is spread wily-nilly across a bunch of event handlers and presentational components.

So perhaps a more productive framing than MVC is that a client frontend will need to have:

- A presentational layer to display things to the user.
- A state layer to maintain application state (e.g. selected tab, accordion expanded, modal open, text input, as well as app-specific things like user preferences or order status).
- A data layer to manage data both locally on device and via network requests.
- Some mechanism for event dispatch to do state transistions and other effects (like POSTing a form).

If you try to collapse that any further than I have here, you will have a bad time. When looking at a given piece of frontend code, it should fall into **exactly one** of those buckets or a **very** simple communication channel between them. If it's more than one bucket and it's not a "dumb" communication/dispatch mechanism, it's almost certainly wrong. If it doesn't fit in _any_ of those buckets, that is also a big red flag. When looking at implementing a given feature, think about what you will need in each of those layers to make it work. **Most software bugs are because of invalid state transitions**! So make the semantics of those transitions _extremely_ clear in your app!

Next time we'll talk about how those layers work (or don't lol) on web.
