var WorkerList = {
    view: function(vnode) {
        const state = vnode.attrs.state

        return m("table", { border: 1 }, state.workers.map(function(worker) {
            const workerActions = [];

            if (worker.state == 'idle') {
                state.tasks.forEach(function(task) {
                    workerActions.push(m('button', {
                        onclick: function() {
                            actions.asignTask(worker.id, task.id);
                        }
                    }, task.name + '[' + (1 + (worker.skills[task.type] || 0)) + ']'));
                });
            }
            else {
                workerActions.push(m('button', {
                    onclick: function() {
                        actions.unasignTask(worker.id);
                    }
                }, 'cancel'));
            }

            return m('tr', [
                m('td', worker.id),
                m('td', worker.name),
                m('td', worker.state),
                m('td', workerActions)
            ]);
        }))
    }
};
