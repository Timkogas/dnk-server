import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import cors from 'cors';
import * as core from 'express-serve-static-core';
import Routes from './routes';
import { connectMongoDB } from './helpers/moongose';
import { cron } from './helpers/cron';
import Db from './Db/Db';

dotenv.config();

class App {
  private _server: http.Server;
  private _app: core.Express;

  constructor() {
    this._app = express();
    this._server = http.createServer(this._app);
    this._init();
  }

  private async _init(): Promise<void> {
    try {
      await this._connectToDatabase();
      this._configureExpress();
      this._startServer();
    } catch (error) {
      console.error('Error during initialization', error);
      process.exit(1);
    }
  }

  private async _connectToDatabase(): Promise<void> {
    const mongoURI: string = process.env.DB_MONGODB_URI;

    try {
      await connectMongoDB(mongoURI);
    } catch (error) {
      console.error('Error connecting to MongoDB', error);
      throw error;
    }
  }

  private _configureExpress(): void {
    const origin: boolean = process.env.DEV ? true : false;

    this._app.use(express.urlencoded({ extended: true }));
    this._app.use(express.json());
    this._app.use(cors({ origin: origin }));
    this._app.use('/public', express.static(__dirname + '/public'));
    this._app.set('views', path.join(__dirname, 'views'));
    this._app.set('view engine', 'ejs');

    this._app.use(async (req, res, next) => {
      try {
        await next();
      } catch (error) {
        res.status(500).send({
          error: true,
          error_text: 'Internal Server Error',
          data: {}
        });
      }
    });

    new Routes(this._app);
  }

  private _startServer(): void {
    this._server.listen(process.env.PORT, (): void => {
      console.log('Server started on port ' + process.env.PORT);
    });
  }
}

new App();