import { paramsToObj } from "./utils.mjs";

export class SyncManager {
  #enqueued = null;
  constructor(url) {
    this.url = url;

    if (typeof window !== "undefined") {
      window.addEventListener("online", () => {
        if (this.#enqueued) this.syncState(this.#enqueued);
      });
    }
  }

  async onload() {
    const urlState = this.syncFromUrl();
    const localState = this.syncLocalState();
    const serverState = await this.syncServerState();
    return { serverState, localState, urlState };
  }

  syncFromUrl(urlQueryString, xforms = {}) {
    const params = new URLSearchParams(urlQueryString);
    return params.size ? paramsToObj(params, xforms) : null;
  }

  syncToUrl(state) {
    const { count, userInput } = state;
    const url = new URL(location.href);
    const params = new URLSearchParams({ count, userInput }).toString();
    url.search = params;
    // We _could_ use pushState here and set up a popState listener to
    // re-sync back to the DOM and let the user use the back and forward
    // browser buttons instead of manually adding undo/redo buttons, but
    // because most websites are trash I don't think most users expect
    // those to work that way.
    history.replaceState(null, "", url);
  }

  async syncServerState(state) {
    if (state) {
      this.#enqueued = state;
      try {
        const resp = await fetch(this.url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(state),
        });

        if (resp.ok) this.#enqueued = null;
        return null;
      } catch (err) {
        console.error(err);
      }
    } else {
      const resp = await fetch(this.url);
      const st = await resp.json();
      return st;
    }
  }

  syncLocalState(state) {
    if (typeof localStorage !== "undefined") {
      if (state) {
        localStorage.setItem("state", JSON.stringify(state));
      } else {
        const st = localStorage.getItem("state");
        return st ? JSON.parse(st) : null;
      }
    }

    return state;
  }

  syncState(state) {
    this.syncServerState(state).catch(console.error);
    this.syncToUrl(state);
    return this.syncLocalState(state);
  }
}
