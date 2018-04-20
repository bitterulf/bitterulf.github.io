function initStrategy(be) {
    var log = logServer;
    var logins = {};
    var users = {
        bob: { password: 'king' }
    };
    var state = {
        loggedInUsers: []
    };

    var planets = [
        { name: 'earth' },
        { name: 'mars' },
        { name: 'venus' }
    ];

    be.addEventListener("strategy.actionRequest", function(event) {
       var detail = event.detail;
        log('connectionId', detail.connectionId);
        var user = logins[detail.connectionId];

        if (detail.action === 'login') {
           var username = detail.payload.username;
           var password = detail.payload.password;
           if (users[username] && users[username].password === password ) {
               logins[detail.connectionId] = username;
               be.dispatchEvent(new CustomEvent("archive.updateLogins", { detail: logins }));

               if (state.loggedInUsers.indexOf(username) === -1) {
                   state.loggedInUsers.push(username);

                    be.dispatchEvent(new CustomEvent("archive.saveData", { detail: {
                        key: 'loggedInUsers',
                        content: state.loggedInUsers
                    } }));
                    be.dispatchEvent(new CustomEvent("archive.saveData", { detail: {
                        key: 'planets',
                        content: planets
                    } }));
               }
           }
        }
        else if (user) {
            if (detail.action === 'dance') {
                log(user + ' is dancing');
                be.dispatchEvent(new CustomEvent("archive.sendMessage", { detail: {
                   connectionId: detail.connectionId,
                   content: user +' is dancing'
                } }));
            }
        }
    })
}
