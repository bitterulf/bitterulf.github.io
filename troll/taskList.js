var TaskList = {
    view: function(vnode) {
        const state = vnode.attrs.state

        return m("table", { border: 1 }, state.tasks.map(function(task) {
            let summedWorkPower = 0;
            task.asignedWorkers.forEach(function(entry) {
                summedWorkPower += entry.workPower;
            });

            const finishedIn = summedWorkPower ? 'finished in '+Math.ceil(task.remainingTime / summedWorkPower) : 'paused' ;
            return m('tr', [
                m('td', task.id),
                m('td', task.name),
                m('td', task.type),
                m('td', task.remainingTime + '/' + task.time + '/' + summedWorkPower),
                m('td', finishedIn),
                m('td', task.asignedWorkers.map(function(entry) {
                    return m('div', entry.name + '[+' + entry.workPower + ']');
                }))
            ]);
        }))
    }
};
