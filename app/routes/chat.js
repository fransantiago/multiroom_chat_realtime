const chatController = require('../controllers/chat');
const middlewares = require('../middlewares/custom');

module.exports = app => {
    app.post('/chat', 
        middlewares.validateFormFields, 
        (req, res, next) => {
            if(app.get('participantes').some(participante => participante  === req.body.apelido))
            return res.render('index', {erros: [{msg: `${req.body.apelido} já está em uso.`}]});
            next();
        },
        chatController.store);
}