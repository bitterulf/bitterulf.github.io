const util = require('util'),
    EventEmitter = require('events').EventEmitter;

const Validator = function() {
  const self = this;
  this.state = {};

  this.on('intent', function(data) {
    if (data.origin.type == 'user' && self.state.existingUsers.indexOf(data.origin.id) > -1) {
        if (data.action == 'dance') {
            self.logSomething({user: 'bob', type: 'dance'});
            this.emit('validated', data);
        }
    }
  });

  this.on('update', function(data) {
      self.state = data;
  });

  this.logSomething('init');
};

util.inherits(Validator, EventEmitter);

Validator.prototype.intent = function(data) {
  this.emit('intent', data);
};

Validator.prototype.update = function(data) {
  this.emit('update', data);
};

Validator.prototype.logSomething = function(something) {
  console.log(something);
}

const Mutator = function() {
  const self = this;
  this.state = {};

  this.on('intent', function(data) {
    if (data.action == 'dance') {
        this.emit('mutation', {type: 'addMessage', payload: { owner: data.origin.id, content: data.origin.id + ' is dancing ' + data.payload.style + ' style'} });
    }
  });

  this.on('update', function(data) {
      self.state = data;
  });
};

util.inherits(Mutator, EventEmitter);

Mutator.prototype.intent = function(data) {
  this.emit('intent', data);
};

Mutator.prototype.update = function(data) {
  this.emit('update', data);
};

const Archive = function() {
  const self = this;
  this.state = {
      existingUsers: ['bob', 'stuart'],
      messages: []
  };

  this.on('mutate', function(data) {
      if (data.type == 'addMessage') {
          self.state.messages.push(data.payload);
      }
      console.log('archive should mutate', self.state);
      self.emit('stateChanged', self.state);
  });

  this.on('sync', function() {
      self.emit('stateChanged', self.state);
  });
};

util.inherits(Archive, EventEmitter);

Archive.prototype.mutate = function(data) {
  this.emit('mutate', data);
};

Archive.prototype.sync = function() {
  this.emit('sync');
};

const Fog = function() {
  const self = this;
  this.state = {};
  this.on('update', function(data) {
      this.state = data;
      self.state.existingUsers.forEach(function(username) {
          self.emit('push', { username: username, payload: {
                messages: self.state.messages.filter(function(message) {
                    return message.owner === username;
                })
          }});
      });
  });
  this.on('resync', function(username) {
      if (self.state.existingUsers.indexOf(username) > -1) {
            self.emit('push', { username: username, payload: {
                messages: self.state.messages.filter(function(message) {
                    return message.owner === username;
                })
          }});
      }
  });
};

util.inherits(Fog, EventEmitter);

Fog.prototype.update = function(data) {
  this.emit('update', data);
};

Fog.prototype.resync = function(data) {
  this.emit('resync', data);
};

const v = new Validator();

const m = new Mutator();

const a = new Archive();
const f = new Fog();

m.on('mutation', function(data) {
    a.mutate(data);
});

v.on('validated', function(data) {
    m.intent(data);
});

a.on('stateChanged', function(data) {
    v.update(JSON.parse(JSON.stringify(data)));
    m.update(JSON.parse(JSON.stringify(data)));
    f.update(JSON.parse(JSON.stringify(data)));
});

f.on('push', function(data) {
    console.log(util.inspect(data, false, null))
});

a.sync();

v.intent({origin: { type: 'user', id: 'bob' }, action: 'dance', payload: { style: 'robot'}});

f.resync('bob');

// add fog
// add ping on change
