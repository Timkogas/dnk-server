import express from 'express';
import path from 'path';
import http from 'http';
import dotenv from 'dotenv';
import cors from 'cors';
import * as core from 'express-serve-static-core';
import Routes from './routes';
import { connectMongoDB } from './helpers/moongose';

dotenv.config();

const jsonErrorHandler = (err, req, res, next) => {
  res.status(500).send({
    error: true,
    error_text: 'Internal Server Error',
    data: {}
  });
}

class App {
  constructor() {
    this._init();
  }

  private _server: http.Server;
  private _app: core.Express;

  private async _init(): Promise<void> {
    const mongoURI: string = process.env.DB_MONGODB_URI;

    try {
      await connectMongoDB(mongoURI);
    } catch (error) {
      console.error('Error connecting to MongoDB', error);
      process.exit(1);
    }

    const origin: boolean = process.env.DEV ? true : false;
    this._app = express();
    this._app.use(express.urlencoded({ extended: true }));
    this._app.use(express.json());
    this._app.use(jsonErrorHandler)
    this._app.use(cors({ origin: origin }));
    this._app.use('/public', express.static(__dirname + '/public'));
    this._app.set('views', path.join(__dirname, 'views'));
    this._app.set('view engine', 'ejs');
    this._server = http.createServer(this._app);
    this._server.listen(process.env.PORT, (): void => console.log('Server started on port ' + process.env.PORT));
    new Routes(this._app)
  }
}
new App();