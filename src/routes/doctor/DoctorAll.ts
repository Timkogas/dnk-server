import * as core from 'express-serve-static-core';
import Doctor from '../../models/Doctor';

let requestCounter = {};

setInterval(() => {
    requestCounter = {};
}, 100000);

export default class DoctorAll {
  constructor(app: core.Express) {
    this._app = app;
    this._init();
  }

  private _app: core.Express;

  private _init(): void {
    this._app.get('/doctor/all', async (req, res): Promise<void> => {
      const clientIP = req.ip;
      requestCounter[clientIP] = requestCounter[clientIP] || 0;
      requestCounter[clientIP]++;
  
      if (requestCounter[clientIP] > 80) { 
          res.json({
              error: true,
              error_text: 'to many requests',
              data: {}
          })
          return
      }
      try {
        const doctors = await Doctor.find();
        res.json({
          error: false,
          error_text: '',
          data: {
            doctors: doctors
          }
        });
      } catch (error) {
        console.error('Error fetching doctors', error);
        res.json({
          error: true,
          error_text: 'Internal Server Error',
          data: {}
        });
      }
    });
  }
}