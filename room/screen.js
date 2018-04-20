function initScreen(fe) {
    var log = logClient;
    var state = {
        remote: {}
    };

    fe.addEventListener("screen.click", function(event) {
        var detail = event.detail;
        if (detail.name === 'login') {
            log(event);
            fe.dispatchEvent(new CustomEvent("delivery.actionDelivery", {
                detail: {
                    action: 'login',
                    payload: {
                        username: 'bob',
                        password: 'king'
                    }
                }
            }));
        }
        else if (detail.name === 'dance') {
            log(event);
            fe.dispatchEvent(new CustomEvent("delivery.actionDelivery", {
                detail: {
                    action: 'dance',
                    payload: {
                    }
                }
            }));
        }
    });

    fe.addEventListener("screen.render", function(event) {
        state.remote = event.detail;
        m.redraw();
    });

    var onclick = function(ev) {
        var data = Object.assign({}, ev.target.dataset);
        fe.dispatchEvent(new CustomEvent(
            "screen.click", { detail: data }
        ));
    };

    fe.addEventListener("screen.message", function(event) {
        log('screen got: ' + event.detail);
    });

    var Screen = {
        view: function() {
            return m("main", [
                state.remote.loggedInUsers ? m('div', state.remote.loggedInUsers.join(',') ) : null,
                m("button", {
                    "data-name": 'login',
                    onclick: onclick
                }, 'login'),
                m("button", {
                    "data-name": 'nothing',
                    onclick: onclick
                }, 'nothing'),
                m("button", {
                    "data-name": 'dance',
                    onclick: onclick
                }, 'dance')
            ]);
        }
    }

    m.mount(document.getElementById('root'), Screen)
}
