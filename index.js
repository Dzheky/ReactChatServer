const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const Message = require('./message');

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
  socket.on('disconnect', () => {
    console.log(`user ${socket.id} disconnected`);
  });
  socket.on('message', message => {
    console.log(`Message from ${socket.id}: ${message.user}: ${message.text}`);
    Message.create(message, (err, dbMessage) => {
        if (err) return console.error(err);
        io.emit('message', dbMessage);
    });
  });
  Message.find().sort('-created_at').limit(100).exec((err, messages) => {
      if (err) return console.error(err);
      messages.reverse().forEach(message => socket.emit('message', message));
  });
});

http.listen(process.env.PORT, process.env.IP, () => {
    console.log(`Express server listening on ${process.env.IP}:${process.env.PORT}`);
});
