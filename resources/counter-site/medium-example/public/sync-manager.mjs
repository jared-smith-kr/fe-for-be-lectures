import { DEFAULT_STATE } from "./state.mjs";
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
    const localState = this.syncLocalState();
    const serverState = await this.syncServerState();
    return serverState ?? localState ?? DEFAULT_STATE;
  }

  async syncServerState(state) {
    if (state) {
      console.log(`Called with ${JSON.stringify(state)}`);
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
    console.log("here!");
    this.syncServerState(state).catch(console.error);
    return this.syncLocalState(state);
  }
}
