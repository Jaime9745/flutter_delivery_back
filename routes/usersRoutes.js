const UsersController = require('../controllers/usersCotroller');
const User = require('../models/user');

module.exports = (app, upload) => {
    app.get('/api/users/getAll', UsersController.getAll);

    app.post('/api/users/create', upload.array('image', 1), UsersController.registerWithImage);

    app.post('/api/users/login', UsersController.login);
};