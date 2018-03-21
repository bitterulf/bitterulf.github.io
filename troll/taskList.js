var TaskList = {
    view: function(vnode) {
        const state = vnode.attrs.state

        const data = state.tasks.map(function(task) {
            let summedWorkPower = 0;
            task.asignedWorkers.forEach(function(entry) {
                summedWorkPower += entry.workPower;
            });

            const finishedIn = summedWorkPower ? 'finished in '+Math.ceil(task.remainingTime / summedWorkPower) : 'paused' ;
            return [
                task.id,
                task.name,
                task.type,
                task.remainingTime + '/' + task.time + '/' + summedWorkPower,
                finishedIn,
                task.asignedWorkers.map(function(entry) {
                    return m('div', entry.name + '[+' + entry.workPower + ']');
                })
            ];
        });

        return m(Grid, {data: data});
    }
};
