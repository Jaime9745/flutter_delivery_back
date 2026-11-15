import type { Express } from 'express';
import type { Multer } from 'multer';
import UsersController from '../controllers/usersCotroller.ts';

export default (app: Express, upload: Multer) => {
    app.get('/api/users/getAll', UsersController.getAll);

    app.post('/api/users/create', upload.array('image', 1), UsersController.registerWithImage);

    app.post('/api/users/login', UsersController.login);
};
