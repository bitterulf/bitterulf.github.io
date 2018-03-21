var WorkerInfo = {
    view: function(vnode) {
        const state = vnode.attrs.state;

        if (!state.selectedWorker) {
            return '';
        }

        const worker = state.selectedWorker;

        const workerActions = [];

        if (worker.state == 'idle') {
            state.tasks.forEach(function(task) {
                workerActions.push(m(Button, {
                    onclick: function() {
                        actions.asignTask(worker.id, task.id);
                    }
                }, task.name + '[' + (1 + (worker.skills[task.type] || 0)) + ']'));
            });
        }
        else {
            workerActions.push(m(Button, {
                onclick: function() {
                    actions.unasignTask(worker.id);
                }
            }, 'cancel'));
        }

        return m(Grid, {data: [
            [state.selectedWorker.id, state.selectedWorker.name, workerActions]
        ]});
    }
};
