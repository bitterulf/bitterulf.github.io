const actions = {
    asignTask: function(workerId, taskId) {
        events.push({type: 'asignTask', payload: { worker: workerId, task: taskId } });
    },
    unasignTask: function(workerId, taskId) {
        events.push({type: 'unasignTask', payload: { worker: workerId } });
    },
    endTurn: function() {
        state = recalculateState();
        console.log(state.tasks);
        state.tasks.forEach(function(task) {
            let summedWorkPower = 0;
            task.asignedWorkers.forEach(function(entry) {
                summedWorkPower += entry.workPower;
            });

            if (summedWorkPower) {
                if (summedWorkPower < task.remainingTime) {
                    events.push({type: 'improveTask', payload: { task: task.id, workPower: summedWorkPower } });
                }
                else {
                    events.push({type: 'finishTask', payload: { task: task.id } });
                }
            }
        });
    }
};
