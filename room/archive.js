function initArchive(be) {
    var log = logServer;

    var cache = {
        logins: {}
    };
    var state = {};
    be.addEventListener("archive.saveData", function(event) {
        var detail = JSON.parse(JSON.stringify(event.detail));
        state[detail.key] = detail.content;

        Object.keys(cache.logins).forEach(function(connectionId) {
            var user = cache.logins[connectionId];
            log('send to user ' + user);
            be.dispatchEvent(new CustomEvent("delivery.dataDelivery",
                {
                    detail: {
                        connectionId: connectionId,
                        content: JSON.parse(JSON.stringify(state))
                    }
                }
            ));
        });
    })
    be.addEventListener("archive.sendMessage", function(event) {
        be.dispatchEvent(new CustomEvent("delivery.messageDelivery",
            {
                detail: event.detail
            }
        ));
    })
    be.addEventListener("archive.updateLogins", function(event) {
        var detail = JSON.parse(JSON.stringify(event.detail));
        cache.logins = event.detail;
    })
}
