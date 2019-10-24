const { check } = require('express-validator');

module.exports = {
    validateFormFields: [
        check('apelido', 'Apelido é obrigatório.').not().isEmpty(),
        check('apelido', 'Apelido deve conter entre 3 e 15 caracteres.').isLength({min:3, max:15})
    ]
}