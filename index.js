const express = require('express');
const mongoose = require('mongoose');
const SocketCluster = require('socketcluster').SocketCluster;

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('error', (err) => {
    console.error(err);
});

const app = express();

app.get('/', (req, res) => {
    res.json([{
      user: 'system',
      text: 'Welcome to ReactChat!'
    }, {
      user: 'Evgeny',
      text: 'Testing'
    }]);
});

app.listen(process.env.PORT, process.env.IP, () => {
    console.log(`Express server listening on ${process.env.IP}:${process.env.PORT}`);
});