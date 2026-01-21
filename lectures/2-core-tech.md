# The Stuff the Web is Made Of

This is a list of the core web technologies, everything else is built on top of these:

- IP
- TCP
- UDP
- HTTP(S)
- URLs
- DNS
- Browsers
  - HTML
  - CSS
  - JavaScript
  - DOM
- Websockets

If you don't understand how those work, you don't understand how the web works. I don't care how much React you know. Frontend development has become such a specialized discipline that developers often focus only on what happens in the browser or even just _parts_ of what happens in the browser (HTML/CSS vs Javascript, the [Great Divide](https://css-tricks.com/the-great-divide/)) but realistically it's every bit as important if not moreso to understand what happens _outside_ the browser, _especially_ as a full stack dev.

I'm not going to rehash a bunch of stuff that is easily learned from AI/Google/Wikipedia, but briefly:

## TCP/IP and UDP

IP denotes the scheme that gives points of interest on the internet unique addresses (I'm punting on IPv4/IPv6, NAT, BGP, etc but those are good things for a technology professional to know). TCP is a protocol for reliable transmission of data over IP. UDP is a connectionless protocol over IP and unlike TCP does not guarantee delivery, ordering, etc. It's useful for things where dropped packets aren't a big deal (e.g. media streaming).

## DNS

Domain name service: maps IP addresses to human-readable identifiers. When you put google.com in a browser address bar and hit enter DNS is what resolves that to e.g. 100.64.0.1, which is what the unix `nslookup` utility helpfully tells me is the current address for google.com for me.

## URLs

Uniform Resource Locator, i.e. the location of a resource like the server that serves the google search page.

## HTTP(S)

Hypertext Transfer Protocol - the text-based protocol that we use to send web resources from one place to another on top of TCP/IP. There are 3 major versions of HTTP, in practice _most_ web servers are, at the time I write this, still using HTTP/2 and not yet 3. Very, very few are still using HTTP 1.1. Most of the salient differences between the versions revolve around performance optimizations. HTTPS is a secure variant of HTTP that adds encryption but otherwise works pretty much the same.

## Websockets

The typical setup for web is that a client like a browser makes a request, there is a server listening for requests, the server answers requests, and that's it. But if you need regular, bi-directional communication between the client and the server a websocket is a persistent connection that either party can send data over. For instance you would use a websocket for collabrative document editing or a multiplayer online game.

## BROWSERS

Browsers are the software that render web pages. The big ones are Chrome, Firefox, Safari, Edge. Browsers do a bunch of things: rendering, networking, security, storage, etc. The core technologies that browsers implement are:

- HTML - Hypertext Markup Language, the language used to structure web pages.
- CSS - Cascading Style Sheets, the language used to change the appearance web pages.
- JavaScript - the programming language used to make web pages interactive.
- DOM - Document Object Model, the API that allows JavaScript to interact with HTML and CSS. Note that it existed before
  and outside of the web (e.g. for interacting with XML documents) but is most commonly used in the context of web
  browsers today.

Except that the bit about JavaScript is a lie: JavaScript can be and is frequently used to generate the HTML and CSS that in days of yore would have been static assets served by the web server. This is called client-side rendering (CSR) as opposed to server-side rendering (SSR) where the server generates the HTML and CSS and sends it to the browser. Except that previous sentence is also a lie because "server-side rendering" could be static files, or templated content from a traditional web backend language like Ruby, Python, PHP, etc. or it could be JavaScript running on the server that tries to minimize the difference between what happens on the server and what happens on the client from the programmer's perspective.

Clear as mud?

If you're confused don't worry, you're not the only one. Web developers are often looked down on by "real" software developers but web programming is actually _harder_ than traditional software development. What the web developers _won't_ tell you (and may not have a broad enough perspective to even realize) is that the reason it's harder has to do with the complexity and baggage of the web platform itself, not that they're necessarily solving harder actual problems. Occasionally you will even see pseudo-luddite webdevs rant about returning to the good ol' days of static HTML pages served from Apache because it was simpler and in many ways offered a better user experience. Unfortunately consumer standards for user experience have risen and users now expect full app-like experiences. Which are hard to deliver on the web platform. So you have this circularity problem where instead of picking something that the team can reliably deliver we keep trying to push the web platform to do things it just wasn't ever meant to do with varied and often disappointing results but the occasional smashing successes (e.g. Google Maps, Figma, etc) keep driving everybody to try.

Anyways, lets talk about those technologies a little more in depth. Next time we'll start actually _using_ them.

### HTML

HTML is what gives the document it's structure. It looks like this:

```html
<h1>Hi I'm a heading!</h1>
<p>This is a paragraph of some text</p>
```

The angle bracket things are called _tags_ or _elements_. There are [a whole honkin' lot of them](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements). A lot of them exist because of an idea (controversial, too much background even for this series) that HTML should be _semantic_, i.e. a dialog is a dialog _element_, an aside is an aside _element_, that a section of a page should be a section _element_. If you hear somebody, especially an accessibility expert, ranting about semantic HTML, they mean that. Because the alternative is called "div soup" and looks like this:

```html
<div id="dialog">
  <div id="dialog-heading">Title of the Song</div>
  <div id="dialog-contents">buncha lyrics</div>
  <div>info about the song</div>
</div>
```

instead of this:

```html
<dialog>
  <h3>Title of the Song</h3>
  <section>buncha lyrics</section>
  <aside>info about the song</aside>
</dialog>
```

The `div` tag is the most generic, unspecial HTML tag. So the first version requires a bunch of custom CSS styling to do what the second version does naturally. The second version is also better for adaptive technologies like screen readers, SEO, perf in genreal since you're sending less over the wire, etc. The takeaway here is before you _create_ a visual element out of the raw webstuff of divs and styles, check first if there's a built-in thing that does what you need. It may even be a legal requirement unless you are really good with `aria-role` attributes, and if you are you're probably already using semantic HTML anyway.

There are many problems with HTML but most of them revolve either around trying to stretch the idea of a "document" to cover things like Google Maps, or even plain text-based interactivity. Trying to build a WYSIWG editor or a spreadsheet program on web will **definitely** make you question your life choices. I've done the first, I learned better to even attempt the second, and I'm sure the Google Docs people all keep a bottle in the top right desk drawer.

DOM is the in-memory, programmatically accessible representation of these HTML entities, so each tag implicitly has a matching node in the DOM.

### CSS

CSS is the worst programming language that you will ever use (statistically). That's something I would phrase more politely for a general audience, but dear reader/listener it's just you and me today. There are many people who will try to defend CSS and claim it's a skill issue on the part of the person doing the criticizing. And to be totally fair there are a lot of uninformed critiques of various web technologies, but still those people are lying to themselves: CSS is terrible. That doesn't mean that CSS experts are dumb, or wasting their time, or that the people on the CSS working group are dumb. On the contrary, CSS expertise is an extremely valuable and difficult skillset, in the same way that COBOL programming on IBM mainframes is a difficult and valuable skillset. That doesn't make it _not_ a vestigial remnant of a bygone era where we've learned better as an industry since.

#### Layout

CSS has six (6!!) different layout algorithms, only one of which has a truly first-class representation in the language (tables) and people will spit on you (at _best_) if you commit the apparently grave sin of doing something as passe as using tables for layout. I mean, why use tables when you can do this?

```html
<div
  role="table"
  aria-label="Populations"
  aria-describedby="country_population_desc"
>
  <div id="country_population_desc">World Populations by Country</div>
  <div role="rowgroup">
    <div role="row">
      <span role="columnheader" aria-sort="descending">Country</span>
      <span role="columnheader" aria-sort="none">Population</span>
    </div>
  </div>
  <div role="rowgroup">
    <div role="row">
      <span role="cell">Finland</span>
      <span role="cell">5.5 million</span>
    </div>
    <div role="row">
      <span role="cell">France</span>
      <span role="cell">67 million</span>
    </div>
  </div>
</div>
```

This is called "tell me you use tables without telling me you use tables" (remember my criticism of "div soup" above?) and is one of the more pointless fashion-based
shibboleths in the dustbin of webdev history. [Source](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/row_role).

The rest of the layout algorithms live in the `display` property if you're luck and otherwise you just have to know which ones are invoked by which magic incantations (and what the precendence order is when they conflict!). If you add a CSS style and it doesn't do anything to change the appearance of the element you've applied it to chances are that style isn't valid in the invisible (in the code) context of the layout algorithm being used on the element. There are 660 different CSS style properties, a (different) subset of them are applicable in a given layout context, and there are no rules or patterns you just have to memorize which things work in what (again, invisible) layout contexts. Or do what most web developers do and just randomly add and subtract stuff until it looks right. If you're a web developer reading/hearing this and bristling because you know enough CSS to not need to cross your fingers and bang on it with a hammer until it works, _trust me_: you're well above average.

#### Selectors

CSS does its work through _selectors_ that target specific DOM nodes or lists of DOM nodes (remember these are the in-memory representation of HTML entities). There is a semi-arcane DSL for selectors that looks like this:

```css
.my-class {
  background-color: #000;
}

#specific-element-id {
  text-align: center;
  font-style: italic;
}

li {
  color: black;
}

li:hover {
  color: red;
}

@media (width <= 1200px) {
  #size-matters: {
    display: block;
  }

  #actual-content: {
    display: none;
  }
}
```

You can select by HTML id attribute (the `#` means "id" in CSS), HTML class name attribute (the `.` character means class, NOTE: this has _nothing_ to do with and more-or-less preceded classes in the object-oriented sense for maximum confusion), tag name, etc. and the styles in the curly braces are applied to whatever element(s) match the selector, _and their children in the DOM tree_. More on that in a second. In addition there are decendent selectors, pseudo selectors, media queries for the size and type of the device, etc. Since it's possible for a given element to be the target of many selectors (a typical website contains thousands to hundreds of thousands of lines of CSS) when conflicts between the properties occur which one wins? There is a well-defined precendence but given how poor CSS tooling is in comparison to e.g. JavaScript tooling a lot of developers just end up adding the `!important` qualifier which reverses the precendence order. Unless there's a tie between two `!important` attributes, in which case the browser uses the one with the higher specificity in the conventional sense. Madness.

#### Inheritance

Most CSS properties not only adhere to the target(s) noted by the selector but also as stated above their _children_ in the document tree as well. This is the "Cascading" part of Cascading Style Sheets. If you're reading this and thinking "wait a minute, isn't inheritance bad?" yes, yes it is. Sure glad we made it the default behavior for CSS! But again, consider the document-oriented heritage: you _want_ things like _typography_ to work that way: font-size, font-family, etc. This misfeature is just more detritus of a model that was stretched waaaay too far.

#### Box Model

CSS uses a box model for content (at least in certain situations with certain layout algorithms). It looks like this:

![CSS box model diagram](../resources/css-box.png)

[Source](https://www.geeksforgeeks.org/css/css-box-model/)

I've talked a lot of smack about CSS here, with good reason, but the box model is pretty reasonable. Just don't forget that the `width` and `height` styles specify the dimensions of the _inner_ box, you have to add margin/padding/borders yourself if you care about the _total_ width and height of the element, this _frequently_ trips up beginners.

### JavaScript

You know this one already. But on web frontend you ~~get to~~ have to deal with the Web APIs: DOM, localStorage, IndexedDB, Web Workers, ServiceWorker, WebAudio, 2D/3D Canvas, fetch, XmlHttpRequest, matchMedia, etc. These are synonymous with JavaScript itself to many people.

## That's a Wrap

Last time we talked about the breakdown of frontends from a architectural POV, each frontend needs:

- A presentational layer to display things to the user.
- A state layer to maintain application state (e.g. selected tab, accordion expanded, modal open, text input, as well as app-specific things like user preferences or order status).
- A data layer to manage data both locally on device and via network requests.
- Some mechanism for event dispatch to do state transistions and other effects (like POSTing a form).

So to map these web technologies to those layers:

- HTML and CSS live in the presentational layer.
- JavaScript is used for basically all the other layers.

I would call the rest (e.g. TCP/IP, DNS) "plumbing" but I think that reinforces the idea that they are less important to the user experience than the browser technologies and yet most problems stem from misunderstanding or misuse of the "plumbing" layer. Also you already you can see why these separate concerns above get muddled together so easily on web: we split based on technology rather than concern. Next time we'll start looking at how to use some of these technologies to build these layers out properly on web.
