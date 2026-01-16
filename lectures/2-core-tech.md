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

Hypertext Transfer Protocol - the text-based protocol that we use to send web resources from one place to another on top of TCP/IP. There are 3 major versions of HTTP, in practice _most_ web servers are, at the time I write this, still using HTTP/2 and not yet 3. Very, very few are still using HTTP 1.1. Most of the salient differences between the versions revolve around performance optimizations. HTTPS is a secure variant of HTTP that adds encryption but otherwise works pretty much
the same.

## Websockets

The typical setup for web is that a client like a browser makes a request, there is a server listening for requests, the server answers requests, and that's it. But if you need regular, bi-directional communication between the client and the server a websocket is a persistent connection that either party can send data over. For instance you would use a websocket for collabrative document editing or a multiplayer online game.

## BROWSERS

#TODO
