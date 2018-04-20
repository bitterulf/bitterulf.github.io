function initStore(fe) {
    fe.addEventListener("store.updateData", function(event) {
        // maybe throttle things
        fe.dispatchEvent(new CustomEvent("screen.render", { detail: event.detail }));
    })
    fe.addEventListener("store.message", function(event) {
        // maybe throttle things
        fe.dispatchEvent(new CustomEvent("screen.message", { detail: event.detail }));
    })
}
