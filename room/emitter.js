function Emitter() {
    var eventTarget = document.createDocumentFragment()

    function delegate(method) {
        this[method] = eventTarget[method].bind(eventTarget)
    }

    [
        "addEventListener",
        "dispatchEvent",
        "removeEventListener"
    ].forEach(delegate, this)
}
