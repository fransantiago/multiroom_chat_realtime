const chatController = require('../controllers/chat');
const middlewares = require('../middlewares/custom');

module.exports = app => {
    app.post('/chat',
        middlewares.validateFormFields,
        (req, res, next) => {
            if(app.get('participantes').some(participante => (participante.apelido  === req.body.apelido) && (participante.status)))
                return res.render('index', {erros: [{msg: `${req.body.apelido} já está em uso.`}]});
            next();
        },
        chatController.store);
}