var WorkerList = {
    view: function(vnode) {
        const state = vnode.attrs.state

        const highlights = [];

        const data = state.workers.map(function(worker, workerIndex) {
            if (state.selectedWorker && worker.id == state.selectedWorker.id) {
                highlights.push(workerIndex);
            }

            return [
                m(Button, { onclick: function() {actions.selectWorker(worker.id)} }, worker.id),
                worker.name,
                worker.state
            ];
        })

        return m(Grid, {data: data, highlights: highlights });
    }
};
