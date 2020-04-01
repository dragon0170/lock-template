var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

let lockStatusMap = new Map();

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('enter cube', function(cubeId){
    socket.join(cubeId.toString(), () => {
      console.log(socket.id, 'enter cube', cubeId);
      socket.emit('update lock status', lockStatusMap.get(cubeId) || false);
    })
  });
  socket.on('leave cube', function(cubeId){
    socket.leave(cubeId.toString(), () => {
      console.log(socket.id, 'leave cube', cubeId);
    })
  });
  socket.on('acquire lock', (cubeId) => {
    if (!lockStatusMap.get(cubeId)) {
      lockStatusMap.set(cubeId, true);
      console.log(socket.id, 'acquired lock of cube', cubeId);
      socket.emit('locked', true);
      socket.to(cubeId.toString()).emit('update lock status', true);
    } else {
      console.log(socket.id, 'failed to acquire lock of cube', cubeId);
      socket.emit('locked', false);
    }
  });
  socket.on('release lock', (cubeId) => {
    lockStatusMap.set(cubeId, false);
    console.log(socket.id, 'release lock of cube', cubeId);
    socket.emit('unlocked', true);
    socket.to(cubeId.toString()).emit('update lock status', false);
  });
  socket.on('disconnect', () => {
    console.log('disconnected');
  });
});

http.listen(8000, function(){
  console.log('listening on *:8000');
});
