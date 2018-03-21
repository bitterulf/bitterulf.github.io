plugins.push(
    {
        name: 'workerPlugin',
        prepareState: function(state) {
            state.tasks = [];
            state.asignments = [];
            state.selectedWorker =  null;
        },
        mutators: {
            createWorker: function(tools, state, event) {
                state.workers.push({ id: tools.id(), name: event.payload.name, state: 'idle', skills: {} });
            },
            selectWorker: function(tools, state, event) {
                const worker = state.workers.find(function(worker) {
                    return worker.id == event.payload.worker;
                });
                if (worker) {
                    state.selectedWorker = worker;
                }
            },
            trainWorker: function(tools, state, event) {
                const worker = state.workers.find(function(worker) {
                    return worker.id == event.payload.worker;
                });
                if (worker) {
                    state.trainings.push({
                        worker: worker.id,
                        type: event.payload.type
                    });
                }
            }
        },
        enrichers: [
            function doTraining(tools, state) {
                state.trainings.forEach(function(training) {
                    const worker = state.workers.find(function(worker) {
                        return worker.id == training.worker;
                    });

                    if (worker) {
                        if (!worker.skills[training.type]) {
                            worker.skills[training.type] = 0;
                        }
                        worker.skills[training.type]++;
                    }
                });
            }
        ]
    }
);
