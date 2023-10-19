import * as core from 'express-serve-static-core';
import Doctor from '../../models/Doctor';

let requestCounter = {};

setInterval(() => {
    requestCounter = {};
}, 100000);

export default class DoctorOne {
  constructor(app: core.Express) {
    this._app = app;
    this._init();
  }

  private _app: core.Express;

  private _init(): void {
    this._app.post('/doctor/one', async (req, res): Promise<void> => {
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
        const { id } = req.body;
        if (!id) {
          res.json({
            error: true,
            error_text: 'id is required',
            data: {}
          });
          return;
        }

        const doctor = await Doctor.findOne({ _id: id });

        if (!doctor) {
          res.json({
            error: true,
            error_text: 'Doctor not found',
            data: {}
          });
          return;
        }

        res.json({
          error: false,
          error_text: '',
          data: {
            doctor: doctor
          }
        });
      } catch (error) {
        console.error('Error fetching doctor', error);
        res.json({
          error: true,
          error_text: 'Internal Server Error',
          data: {}
        });
      }
    });
  }
}