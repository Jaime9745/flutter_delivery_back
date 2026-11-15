import express, { type NextFunction, type Request, type Response } from 'express';
import http from 'node:http';
import logger from 'morgan';
import cors from 'cors';
import multer from 'multer';
import { initializeApp, cert, type ServiceAccount } from 'firebase-admin/app';
import serviceAccount from './serviceAccountKey.json' with { type: 'json' };
import users from './routes/usersRoutes.ts';

const app = express();
const server = http.createServer(app);

/*
*INICIALIAZAR FIREBASE ADMIN
*/

initializeApp({
    credential: cert(serviceAccount as ServiceAccount)
});

const upload = multer({
    storage: multer.memoryStorage()
});

const port = Number(process.env.PORT) || 3000;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.disable('x-powered-by');

app.set('port', port);

//LLamar rutas
users(app, upload);

server.listen(port, process.env.HOST || '192.168.1.7', function () {
    console.log(`Aplicacion de Nodejs ${port} Iniciada...`);
    }
);


//ERROR HANDLER
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.log(err);
    res.status(err.status || 500).send(err.stack);
    }
);

export { app, server };
