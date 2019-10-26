const { validationResult } = require('express-validator');

module.exports = {
    index(req, res){
        res.render('chat', {erros: []});
    },

    store(req, res){
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.render('index', {erros: errors.array()});

        const { apelido } = req.body;
        const id = Date.now();

        req.io.emit('newMsgFromServer', {
            apelido,
            id,
            mensagem: ` acabou de entrar no chat`
        });
        
        res.render('chat', {apelido, id});
    }
};