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
    socket.on('disconnect', () => {
        const userIndex = app.get('participantes').findIndex(participante => participante.socketId === socket.id);
        app.get('participantes')[userIndex].status = 0;

        socket.broadcast.emit('newMsgFromServer', {
            apelido: app.get('participantes')[userIndex].apelido,
            id: app.get('participantes')[userIndex].id,
            mensagem: ` saiu do chat.`
        });
    });

    socket.on('newUser', data => {
        const escapedData = {id: data.id, apelido: utilsFunctions.escapeChars(data.apelido)};

        if(!app.get('participantes').some(participante => (participante.apelido === escapedData.apelido) && (participante.status))){
            escapedData.socketId = socket.id;
            escapedData.status = 1;

            app.get('participantes').push(escapedData);
            socket.emit('newUserJoinedTheThread', {participantes: app.get('participantes')});
            socket.broadcast.emit('newUserJoinedTheThread', {participantes: [escapedData] });
        }
    });

    socket.on('newMsgFromClient', data => {
        const escapedData = {id: data.id, apelido: utilsFunctions.escapeChars(data.apelido), mensagem: utilsFunctions.escapeChars(data.mensagem)};
        socket.emit('newMsgFromServer', escapedData);
        socket.broadcast.emit('newMsgFromServer', escapedData);
    });
});

server.listen(3000);