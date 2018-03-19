plugins.push(
    {
        name: 'taskPlugin',
        prepareState: function(state) {
            state.workers = [];
            state.trainings = [];
        },
        mutators: {
            createTask: function(tools, state, event) {
                state.tasks.push({ id: tools.id(), name: event.payload.name, type: event.payload.type, time: event.payload.time,  remainingTime: event.payload.time, asignedWorkers: [] });
            },
            asignTask: function(tools, state, event) {
                const worker = state.workers.find(function(worker) {
                    return worker.id == event.payload.worker;
                });
                const task = state.tasks.find(function(task) {
                    return task.id == event.payload.task;
                });
                if (worker && task) {
                    state.asignments.push({
                        worker: worker.id,
                        task: task.id
                    });
                }
            },
            unasignTask: function(tools, state, event) {
                const worker = state.workers.find(function(worker) {
                    return worker.id == event.payload.worker;
                });
                if (worker) {
                    state.asignments = state.asignments.filter(function(asignment) {
                        return asignment.worker != worker.id;
                    });
                }
            },
            improveTask: function(tools, state, event) {
                const task = state.tasks.find(function(task) {
                    return task.id == event.payload.task;
                });

                task.remainingTime -= event.payload.workPower;
            },
            finishTask: function(tools, state, event) {
                state.tasks = state.tasks.filter(function(task) {
                    return task.id != event.payload.task;
                });
                state.asignments = state.asignments.filter(function(asignment) {
                    return asignment.task != event.payload.task;
                });
            }
        },
        enrichers: [
            function (tools, state) {
                state.asignments.forEach(function(asignment){
                    const worker = state.workers.find(function(worker) {
                        return worker.id == asignment.worker;
                    });
                    const task = state.tasks.find(function(task) {
                        return task.id == asignment.task;
                    });

                    if (worker && task) {
                        console.log(worker.skills);
                        worker.state = task.name;
                        task.asignedWorkers.push({
                            id: worker.id,
                            workPower: 1 + (worker.skills[task.type] || 0),
                            name: worker.name
                        });
                    }
                });
            }
        ]
    }
);
