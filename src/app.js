const consign = require('consign');
const bodyParser = require('body-parser');

const express = require('express');
const app = express();

const server = require('http').Server(app);
const io = require('socket.io')(server);

const utilsFunctions = require('../app/utils');

app.set('participantes', []);

app.set('view engine', 'ejs');
app.set('views', './app/views');

app.use(express.static('app/public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use((req, res, next) => {
    req.io = io;
    next();
});

consign()
    .include('app/routes')
    .then('app/models')
    .into(app);

io.on('connection', socket => {    
    socket.on('newUser', data => {
        const escapedData = {apelido: utilsFunctions.escapeChars(data.apelido)};
        if(!app.get('participantes').some(participante => participante === escapedData.apelido)){
            app.get('participantes').push(escapedData.apelido);

            socket.emit('newUserJoinedTheThread', {apelido: app.get('participantes')});
            socket.broadcast.emit('newUserJoinedTheThread', {apelido: [escapedData.apelido] });
        }
    })

    socket.on('newMsgFromClient', data => {
        const escapedData = {apelido: utilsFunctions.escapeChars(data.apelido), mensagem: utilsFunctions.escapeChars(data.mensagem)};
        socket.emit('newMsgFromServer', escapedData);
        socket.broadcast.emit('newMsgFromServer', escapedData);
    });
});

server.listen(3000);