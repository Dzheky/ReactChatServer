const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('error', (err) => {
    console.error(err);
});



app.get('/', (req, res) => {
    res.json([{
      user: 'system',
      text: 'Welcome to ReactChat!'
    }, {
      user: 'Evgeny',
      text: 'Testing'
    }, {
        user: 'Ванька',
        text: 'пробую русский текст'
    }]);
});

io.on('connection', (socket) => {
  console.log(`a user ${socket.id} connected`);
  socket.on('disconnect', function(){
    console.log(`user ${socket.id} disconnected`);
  });
  socket.on('message', message => {
    console.log(`Message from ${socket.id}: ${message.user}: ${message.text}`);
    io.emit('message', message);
  });
  [{
      user: 'system',
      text: 'Welcome to ReactChat!'
    }, {
      user: 'Evgeny',
      text: 'Testing'
    }, {
        user: 'Ванька',
        text: 'пробую русский текст'
  }].forEach(message => socket.emit('message', message));
});

http.listen(process.env.PORT, process.env.IP, () => {
    console.log(`Express server listening on ${process.env.IP}:${process.env.PORT}`);
});