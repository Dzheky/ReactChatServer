const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const MessageDB = require('./message');
const UserDB = require('./users');

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
  console.log(`a user ${socket.id}, uuid: ${socket.handshake.uuid} connected`);

  socket.on('disconnect', () => {
    console.log(`user ${socket.id} disconnected`);
  });
  socket.on('message', message => {
    console.log(`Message from ${socket.id}: ${message.user}: ${message.text}`);
    MessageDB.create(message, (err, dbMessage) => {
        if (err) return console.error(err);
        io.emit('message', dbMessage);
    });
  });

  socket.on('user', user => {
    console.log('Request for new username: ' + user.userName);
    UserDB.findOne({userName: user.userName}, function(err, result) {
      if(err) console.log(err);
      if(result !== null) {
        io.emit('user', {message: 'This name is taken.'});
      } else {
        UserDB.create(user, (err, dbUser) => {
          if(err) return console.error(err);
          io.emit('user', {message: true});
        });
      }

    })

  })

  MessageDB.find().sort('-created_at').limit(100).exec((err, messages) => {
      if (err) return console.error(err);
      messages.reverse().forEach(message => socket.emit('message', message));
  });
});

http.listen(process.env.PORT, process.env.IP, () => {
    console.log(`Express server listening on ${process.env.IP}:${process.env.PORT}`);
});
