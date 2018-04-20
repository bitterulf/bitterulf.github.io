function initDelivery(fe, be) {
    var log = logClient;
    var connectionId = 'connection1';

    fe.addEventListener("delivery.actionDelivery", function(event) {
        var detail = JSON.parse(JSON.stringify(event.detail));
        detail.connectionId = connectionId;
        be.dispatchEvent(new CustomEvent("strategy.actionRequest", { detail: detail }));
    })

    be.addEventListener("delivery.dataDelivery", function(event) {
        if (!event.detail.connectionId) {
            log('send to all');
            fe.dispatchEvent(new CustomEvent("store.updateData", { detail: event.detail.content }));
        }
        else if (event.detail.connectionId === connectionId) {
            log('send to one');
            fe.dispatchEvent(new CustomEvent("store.updateData", { detail: event.detail.content }));
        }
    })

    be.addEventListener("delivery.messageDelivery", function(event) {
        if (event.detail.connectionId === connectionId) {
            fe.dispatchEvent(new CustomEvent("store.message", { detail: event.detail.content }));
        }
    })
}
